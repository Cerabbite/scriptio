import { NextApiRequest, NextApiResponse } from "next";
import { VerificationStatus } from "../../src/lib/utils";
import {
    getUserFromId,
    updateUser,
} from "../../src/server/service/user-service";

const redirect = (res: NextApiResponse, status: VerificationStatus) => {
    const REDIRECTION = "/login?verificationStatus=";
    res.redirect(REDIRECTION + status);
};

export default async function verify(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (!req.query.id || !req.query.code) {
            // scriptio.app/api/verify?id=userId&code=emailHash
            return redirect(res, VerificationStatus.FAILED);
        }

        const id = +req.query.id!;
        const emailHash = req.query.code;
        const user = await getUserFromId(id, true);

        if (!user || emailHash !== user.secrets.emailHash) {
            return redirect(res, VerificationStatus.FAILED);
        }

        if (user.verified) {
            return redirect(res, VerificationStatus.USED);
        }

        const updated = await updateUser({ id: { id }, verified: true });
        if (!updated) {
            return redirect(res, VerificationStatus.FAILED);
        }

        redirect(res, VerificationStatus.SUCCESS);
    } catch (error: any) {
        redirect(res, VerificationStatus.FAILED);
    }
}
