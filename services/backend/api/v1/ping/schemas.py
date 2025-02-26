from ninja import Schema


class PingOut(Schema):
    status: str = "ok"
