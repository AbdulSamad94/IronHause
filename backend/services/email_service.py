"""
Email notification service using Resend.

Sends instant alerts to the gym owner when a lead is captured
or a session is booked via the AI agent.
"""
import html
import logging

import anyio
import resend

from core.config import settings

logger = logging.getLogger(__name__)

if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY

# ─── Design tokens (light theme — works in all email clients) ─────────────────
_PAGE_BG    = "#F1F5F9"   # slate-100 — outer page
_CARD_BG    = "#FFFFFF"   # pure white card
_BORDER     = "#E2E8F0"   # slate-200
_ROW_ALT    = "#F8FAFC"   # slate-50 — alternating row tint
_TEXT_HEAD  = "#0F172A"   # slate-900
_TEXT_BODY  = "#475569"   # slate-600
_TEXT_MUTED = "#94A3B8"   # slate-400
_LABEL      = "#64748B"   # slate-500
_CYAN       = "#00F0FF"   # brand cyan — accent only
_PURPLE     = "#7000FF"   # brand purple — accent only
_BTN_BG     = "#0F172A"   # dark button — readable, premium


def _is_configured() -> bool:
    return bool(settings.RESEND_API_KEY and settings.NOTIFICATION_EMAIL)


def _badge(text: str, color: str) -> str:
    """Inline badge pill — used in header."""
    return f"""<span style="display:inline-block;padding:4px 12px;border-radius:100px;
        background-color:transparent;border:1.5px solid {color};
        font-size:11px;font-weight:600;letter-spacing:0.8px;color:{color};
        font-family:'DM Sans',Arial,sans-serif;text-transform:uppercase;">{text}</span>"""


def _row(label: str, value: str, alt: bool = False, value_style: str = "") -> str:
    """Single key-value row in the details table."""
    bg = _ROW_ALT if alt else _CARD_BG
    return f"""
      <tr>
        <td style="padding:14px 24px;width:32%;border-bottom:1px solid {_BORDER};
                    background-color:{bg};vertical-align:top;">
          <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.7px;
                     color:{_LABEL};font-family:'DM Sans',Arial,sans-serif;
                     text-transform:uppercase;">{label}</p>
        </td>
        <td style="padding:14px 24px;border-bottom:1px solid {_BORDER};
                    background-color:{bg};vertical-align:top;">
          <p style="margin:0;font-size:14px;font-weight:500;color:{_TEXT_HEAD};
                     font-family:'DM Sans',Arial,sans-serif;line-height:1.6;{value_style}">{value}</p>
        </td>
      </tr>"""


def _base_email(title: str, preview: str, badge_text: str, badge_color: str,
                headline: str, subline: str, accent: str, body_html: str) -> str:
    return f"""<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
            <title>{title}</title>
            <!--[if mso]><style>td,th,p,a{{font-family:Arial,sans-serif!important}}</style><![endif]-->
            <style>
              @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
              body,table,td,a{{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}}
              table,td{{mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse}}
              body{{margin:0;padding:0;background-color:{_PAGE_BG};
                    font-family:'DM Sans',Arial,sans-serif}}
            </style>
          </head>
          <body style="margin:0;padding:0;background-color:{_PAGE_BG};">

            <!-- Inbox preview text -->
            <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:{_PAGE_BG};">
              {preview}&nbsp;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                  style="background-color:{_PAGE_BG};">
              <tr>
                <td align="center" style="padding:48px 16px 56px;">

                  <table width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="max-width:580px;">

                    <!-- ── Gradient accent bar ── -->
                    <tr>
                      <td style="height:3px;border-radius:3px 3px 0 0;font-size:0;line-height:0;
                                  background:linear-gradient(90deg,{_CYAN} 0%,{_PURPLE} 100%);">&nbsp;</td>
                    </tr>

                    <!-- ── Header ── -->
                    <tr>
                      <td style="background-color:{_CARD_BG};padding:28px 32px 24px;
                                  border-left:1px solid {_BORDER};border-right:1px solid {_BORDER};">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td>
                              <!-- Logo -->
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="width:8px;height:8px;border-radius:50%;font-size:0;
                                              background:linear-gradient(135deg,{_CYAN},{_PURPLE});">&nbsp;</td>
                                  <td style="padding-left:8px;font-size:16px;font-weight:700;
                                              color:{_TEXT_HEAD};font-family:'DM Sans',Arial,sans-serif;
                                              letter-spacing:-0.2px;">IronHause</td>
                                </tr>
                              </table>
                            </td>
                            <td align="right">{_badge(badge_text, badge_color)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- ── Divider ── -->
                    <tr>
                      <td style="height:1px;background-color:{_BORDER};font-size:0;
                                  border-left:1px solid {_BORDER};border-right:1px solid {_BORDER};">&nbsp;</td>
                    </tr>

                    <!-- ── Hero text ── -->
                    <tr>
                      <td style="background-color:{_CARD_BG};padding:36px 32px 28px;
                                  border-left:1px solid {_BORDER};border-right:1px solid {_BORDER};">
                        <!-- Accent dot line -->
                        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                          <tr>
                            <td style="width:32px;height:3px;border-radius:2px;font-size:0;
                                        background-color:{accent};">&nbsp;</td>
                          </tr>
                        </table>
                        <h1 style="margin:0 0 10px;font-size:24px;font-weight:700;letter-spacing:-0.4px;
                                    color:{_TEXT_HEAD};font-family:'DM Sans',Arial,sans-serif;line-height:1.3;">
                          {headline}
                        </h1>
                        <p style="margin:0;font-size:15px;color:{_TEXT_BODY};
                                  font-family:'DM Sans',Arial,sans-serif;line-height:1.6;">
                          {subline}
                        </p>
                      </td>
                    </tr>

                    <!-- ── Body content ── -->
                    {body_html}

                    <!-- ── Footer ── -->
                    <tr>
                      <td style="background-color:{_ROW_ALT};padding:20px 32px;
                                  border:1px solid {_BORDER};border-top:none;border-radius:0 0 4px 4px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td>
                              <p style="margin:0;font-size:12px;color:{_TEXT_MUTED};
                                        font-family:'DM Sans',Arial,sans-serif;line-height:1.6;">
                                Sent by your
                                <strong style="color:{_TEXT_BODY};font-weight:600;">IronHause AI Agent</strong>
                                &nbsp;&middot;&nbsp; 24/7 automation
                              </p>
                            </td>
                            <td align="right">
                              <a href="https://ironhause.vercel.app"
                                style="font-size:12px;color:{_TEXT_MUTED};
                                        font-family:'DM Sans',Arial,sans-serif;text-decoration:none;">
                                ironhause.vercel.app
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>"""


def _lead_body(name: str, email: str, message: str, lead_id: int) -> str:
    cta_row = f"""
      <!-- CTA -->
      <tr>
        <td style="background-color:{_CARD_BG};padding:24px 32px 32px;
                    border-left:1px solid {_BORDER};border-right:1px solid {_BORDER};">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border-radius:8px;background-color:{_BTN_BG};">
                <a href="mailto:{email}?subject=Following up — IronHause"
                   style="display:inline-block;padding:13px 24px;
                           font-size:14px;font-weight:600;color:#FFFFFF;
                           font-family:'DM Sans',Arial,sans-serif;
                           text-decoration:none;letter-spacing:0.1px;">
                  Reply to {name} &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>"""

    return f"""
      <!-- Details table -->
      <tr>
        <td style="border-left:1px solid {_BORDER};border-right:1px solid {_BORDER};">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"
                 style="border-top:1px solid {_BORDER};">
            <!-- Lead ID header row -->
            <tr>
              <td colspan="2" style="padding:10px 24px;background-color:{_ROW_ALT};
                                      border-bottom:1px solid {_BORDER};">
                <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.7px;
                           color:{_TEXT_MUTED};font-family:'DM Sans',Arial,sans-serif;
                           text-transform:uppercase;">Lead #{lead_id}</p>
              </td>
            </tr>
            {_row("Name", name, alt=False)}
            {_row("Email", f'<a href="mailto:{email}" style="color:#0891B2;text-decoration:none;">{email}</a>', alt=True)}
            {_row("Needs", message, alt=False)}
          </table>
        </td>
      </tr>
      {cta_row}"""


def _booking_body(booking_id: int, preferred_date: str, notes: str) -> str:
    notes_display = notes if notes else "No additional notes"
    status_pill = (f'<span style="display:inline-block;padding:2px 10px;border-radius:100px;'
                   f'background-color:#F0FDF4;border:1px solid #BBF7D0;'
                   f'font-size:12px;font-weight:600;color:#15803D;'
                   f'font-family:\'DM Sans\',Arial,sans-serif;">Pending Confirmation</span>')

    tip_row = f"""
      <!-- Tip box -->
      <tr>
        <td style="background-color:{_CARD_BG};padding:0 32px 32px;
                    border-left:1px solid {_BORDER};border-right:1px solid {_BORDER};">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"
                 style="border-radius:8px;border:1px solid {_BORDER};
                         background-color:{_ROW_ALT};">
            <tr>
              <td style="padding:16px 20px;">
                <p style="margin:0;font-size:13px;color:{_TEXT_BODY};
                           font-family:'DM Sans',Arial,sans-serif;line-height:1.6;">
                  <strong style="color:{_TEXT_HEAD};">Next step:</strong>
                  Reply to confirm the exact time slot and send a calendar invite.
                  Responding within 24 hours increases conversion significantly.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>"""

    return f"""
      <!-- Details table -->
      <tr>
        <td style="border-left:1px solid {_BORDER};border-right:1px solid {_BORDER};">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"
                 style="border-top:1px solid {_BORDER};">
            <tr>
              <td colspan="2" style="padding:10px 24px;background-color:{_ROW_ALT};
                                      border-bottom:1px solid {_BORDER};">
                <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.7px;
                           color:{_TEXT_MUTED};font-family:'DM Sans',Arial,sans-serif;
                           text-transform:uppercase;">Booking #{booking_id}</p>
              </td>
            </tr>
            {_row("Date Requested", preferred_date, alt=False)}
            {_row("Status", status_pill, alt=True)}
            {_row("Notes", notes_display, alt=False)}
          </table>
        </td>
      </tr>
      <!-- Spacer -->
      <tr>
        <td style="height:24px;background-color:{_CARD_BG};
                    border-left:1px solid {_BORDER};border-right:1px solid {_BORDER};">&nbsp;</td>
      </tr>
      {tip_row}"""


async def notify_new_lead(name: str, email: str, message: str, lead_id: int) -> None:
    if not _is_configured():
        return

    safe_name    = html.escape(name)
    safe_email   = html.escape(email)
    safe_message = html.escape(message)

    params = {
        "from": "IronHause AI <onboarding@resend.dev>",
        "to": settings.NOTIFICATION_EMAIL,
        "subject": f"New Lead: {safe_name}",
        "html": _base_email(
            title=f"New Lead: {safe_name}",
            preview=f"{safe_name} is interested in IronHause — {safe_message[:80]}",
            badge_text="New Lead",
            badge_color=_CYAN,
            headline=f"New lead from {safe_name}",
            subline="Your AI agent captured a new prospect. Their details are below.",
            accent=_CYAN,
            body_html=_lead_body(safe_name, safe_email, safe_message, lead_id),
        ),
    }

    try:
        await anyio.to_thread.run_sync(resend.Emails.send, params)
        logger.info("Lead notification sent for lead_id=%s", lead_id)
    except Exception:
        logger.exception("Failed to send lead notification email for lead_id=%s", lead_id)


async def notify_new_booking(booking_id: int, preferred_date: str, notes: str) -> None:
    if not _is_configured():
        return

    safe_date  = html.escape(preferred_date)
    safe_notes = html.escape(notes) if notes else ""

    params = {
        "from": "IronHause AI <onboarding@resend.dev>",
        "to": settings.NOTIFICATION_EMAIL,
        "subject": f"New Booking Request — {safe_date}",
        "html": _base_email(
            title=f"New Booking: {safe_date}",
            preview=f"Intro session requested for {safe_date}. Booking #{booking_id}.",
            badge_text="Booking Request",
            badge_color=_PURPLE,
            headline="New intro session requested",
            subline="A prospect just booked through your AI agent and is waiting for confirmation.",
            accent=_PURPLE,
            body_html=_booking_body(booking_id, safe_date, safe_notes),
        ),
    }

    try:
        await anyio.to_thread.run_sync(resend.Emails.send, params)
        logger.info("Booking notification sent for booking_id=%s", booking_id)
    except Exception:
        logger.exception("Failed to send booking notification email for booking_id=%s", booking_id)
