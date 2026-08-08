import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from ..core.config import settings
from ..core.logger import logger

# Kept for any tests/tools that inspected these during local development.
last_verification_token = None
last_password_reset_token = None


def _send_email(to_email: str, subject: str, html_body: str) -> bool:
    """
    Send an email via Gmail SMTP using an app password.

    Tries STARTTLS on SMTP_PORT first (587 by default), and if that
    times out, falls back to implicit SSL on port 465 — some networks
    (campus/corporate WiFi in particular) block one but not the other.

    Returns True if the email was handed off to Gmail successfully,
    False otherwise (the caller keeps working either way — a flaky
    email provider should never block registration, login, etc.).
    """
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        logger.warning(
            "SMTP is not configured (SMTP_USERNAME/SMTP_PASSWORD missing) — "
            f"skipping email to {to_email}. Subject: {subject}"
        )
        return False

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USERNAME}>"
    message["To"] = to_email

    message.attach(MIMEText(html_body, "html"))

    context = ssl.create_default_context()

    # Attempt 1: STARTTLS on the configured port (587 by default).
    try:
        with smtplib.SMTP(
            settings.SMTP_HOST, settings.SMTP_PORT, timeout=10
        ) as server:
            server.starttls(context=context)
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(
                settings.SMTP_USERNAME,
                to_email,
                message.as_string(),
            )

        logger.info(f"Sent email to {to_email}: {subject}")
        return True

    except smtplib.SMTPAuthenticationError:
        logger.error(
            "Gmail SMTP authentication failed — check SMTP_USERNAME and "
            "SMTP_PASSWORD (must be a 16-character Gmail App Password, "
            "not your normal Gmail password)."
        )
        return False

    except (TimeoutError, OSError) as exc:
        logger.warning(
            f"Port {settings.SMTP_PORT} (STARTTLS) timed out reaching "
            f"Gmail ({exc}) — this usually means a firewall/network is "
            "blocking outbound SMTP. Retrying on port 465 (SSL)..."
        )

    # Attempt 2: implicit SSL on port 465, in case only 587 is blocked.
    try:
        with smtplib.SMTP_SSL(
            settings.SMTP_HOST, 465, context=context, timeout=10
        ) as server:
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(
                settings.SMTP_USERNAME,
                to_email,
                message.as_string(),
            )

        logger.info(f"Sent email to {to_email} via port 465: {subject}")
        return True

    except smtplib.SMTPAuthenticationError:
        logger.error(
            "Gmail SMTP authentication failed on port 465 too — check "
            "SMTP_USERNAME and SMTP_PASSWORD."
        )
        return False

    except (TimeoutError, OSError) as exc:
        logger.error(
            f"Port 465 (SSL) also timed out reaching Gmail ({exc}). "
            "Both common SMTP ports are unreachable from this network — "
            "this is almost always a network/firewall block (common on "
            "campus/corporate WiFi), not a bug in the code. Try again on "
            "a mobile hotspot to confirm, or switch to an HTTP-based "
            "email provider (e.g. Resend/SendGrid) which sends over "
            "port 443 instead of SMTP ports."
        )
        return False

    except Exception as exc:  # noqa: BLE001
        logger.error(f"Failed to send email to {to_email}: {exc}")
        return False


def _email_shell(title: str, message: str, button_text: str, button_url: str) -> str:
    return f"""
    <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
                max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <div style="display:inline-flex; align-items:center; gap:8px; margin-bottom:24px;">
        <div style="width:32px; height:32px; border-radius:10px; background:#0f766e;
                    display:flex; align-items:center; justify-content:center;
                    color:white; font-weight:700; font-size:16px;">C</div>
        <span style="font-size:18px; font-weight:600; color:#0f172a;">ClassHub</span>
      </div>

      <h2 style="color:#0f172a; font-size:20px; margin:0 0 12px;">{title}</h2>

      <p style="color:#475569; font-size:14px; line-height:1.6; margin:0 0 24px;">
        {message}
      </p>

      <a href="{button_url}"
         style="display:inline-block; background:#0f766e; color:white;
                text-decoration:none; padding:12px 24px; border-radius:10px;
                font-size:14px; font-weight:600;">
        {button_text}
      </a>

      <p style="color:#94a3b8; font-size:12px; margin-top:24px; word-break:break-all;">
        Or copy this link: {button_url}
      </p>

      <p style="color:#94a3b8; font-size:12px; margin-top:32px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    """


def send_verification_email(email: str, token: str):
    global last_verification_token
    last_verification_token = token

    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    logger.info(f"Verification link for {email}: {verify_url}")

    html = _email_shell(
        title="Verify your email",
        message=(
            "Welcome to ClassHub! Confirm your email address to finish "
            "setting up your account."
        ),
        button_text="Verify email",
        button_url=verify_url,
    )

    _send_email(email, "Verify your ClassHub email", html)


def send_password_reset_email(email: str, token: str):
    global last_password_reset_token
    last_password_reset_token = token

    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    logger.info(f"Password reset link for {email}: {reset_url}")

    html = _email_shell(
        title="Password Reset Request on ClassHub",
        message=(
            "We received a request to reset your ClassHub password. "
            "This link expires soon, so use it right away."
            " If you didn't request a password reset please don't click the link, you can safely ignore this email."
        ),
        button_text="Reset password",
        button_url=reset_url,
    )

    _send_email(email, "Reset your ClassHub password", html)
