import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import {
    FAILED_USER_DELETION,
    USER_DELETED,
} from "../../../../src/lib/messages";
import { sessionOptions } from "../../../../src/lib/session";
import { onError, onSuccess } from "../../../../src/lib/utils";
import {
    deleteUserFromId,
    getUserFromId,
} from "../../../../src/server/service/user-service";

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query || !req.query.userId) {
        return onError(res, 400, "Query not found");
    }

    const userId = +req.query.userId;
    const user = req.session.user;

    if (!user || !user.isLoggedIn || !userId || userId !== user.id) {
        return onError(res, 403, "Forbidden");
    }

    switch (req.method) {
        case "GET":
            return getMethod(user.id, res);
        case "DELETE":
            return deleteMethod(user.id, res);
    }
}

async function getMethod(userId: number, res: NextApiResponse) {
    const fetchedUser = await getUserFromId(userId);
    if (!fetchedUser) {
        return onError(res, 404, "User with id " + userId + " not found");
    }

    return onSuccess(res, 200, "", fetchedUser);
}

async function deleteMethod(userId: number, res: NextApiResponse) {
    const deleted = await deleteUserFromId(userId);
    if (!deleted) {
        return onError(res, 500, FAILED_USER_DELETION);
    }

    return onSuccess(res, 200, USER_DELETED, null);
}
