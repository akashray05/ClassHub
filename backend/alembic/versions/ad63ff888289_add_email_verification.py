"""add email verification

Revision ID: ad63ff888289
Revises: b2cce2def896
Create Date: 2026-07-31 18:46:45.927044

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "ad63ff888289"
down_revision: Union[str, Sequence[str], None] = "b2cce2def896"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "users",
        sa.Column(
            "is_verified",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "verification_token_hash",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "verification_token_expires_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    # Remove the server default after existing rows are populated.
    op.alter_column(
        "users",
        "is_verified",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("users", "verification_token_expires_at")
    op.drop_column("users", "verification_token_hash")
    op.drop_column("users", "is_verified")