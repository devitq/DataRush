from functools import partial

from ninja import NinjaAPI

from api.v1 import handlers
from api.v1.auth import BearerAuth
from api.v1.competition.views import router as competition_router
from api.v1.ping.views import router as ping_router
from api.v1.user.views import router as user_router

router = NinjaAPI(
    title="DataRush API",
    version="1",
    description="API docs for DataRush",
    openapi_url="/docs/openapi.json",
    auth=BearerAuth()
)


router.add_router(
    "ping",
    ping_router,
)
router.add_router(
    "",
    user_router,
)
router.add_router(
    "",
    competition_router,
)


for exception, handler in handlers.exception_handlers:
    router.add_exception_handler(exception, partial(handler, router=router))
