last_verification_token = None
last_password_reset_token = None


def send_verification_email(email: str, token: str):
    global last_verification_token

    last_verification_token = token

    print(
        f"\nEmail verification link:\n"
        f"http://localhost:8000/users/verify-email?token={token}\n"
    )


def send_password_reset_email(email: str, token: str):
    global last_password_reset_token

    last_password_reset_token = token

    print(
        f"\nPassword reset link:\n"
        f"http://localhost:8000/users/reset-password?token={token}\n"
    )