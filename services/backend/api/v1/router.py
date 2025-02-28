from functools import partial

from ninja import NinjaAPI

from api.v1 import handlers
from api.v1.ping.views import router as ping_router
from api.v1.users.views import router as users_router

router = NinjaAPI(
    title="project_name API",
    version="1",
    description="API docs for project_name",
    openapi_url="/docs/openapi.json",
)


router.add_router(
    "ping",
    ping_router,
)
router.add_router(
    "",
    users_router,
)


for exception, handler in handlers.exception_handlers:
    router.add_exception_handler(exception, partial(handler, router=router))
