import Router from "next/router";
import { useState } from "react";
import useUser from "../../src/lib/useUser";
import { getBase64 } from "../../src/lib/utils";
import { ProjectCreation } from "../../src/server/repository/project-repository";
import FormInfo, { FormInfoType } from "../home/FormInfo";
import UploadButton from "./UploadButton";

type Props = {
    setIsCreating: (isCreating: boolean) => void;
};

const NewProjectPage = ({ setIsCreating }: Props) => {
    const { user, setUser } = useUser();
    const [formInfo, setFormInfo] = useState<FormInfoType | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(
        undefined
    );

    const exitCreating = () => {
        setIsCreating(false);
    };

    const resetFromInfo = () => {
        setFormInfo(null);
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        resetFromInfo();

        const body: Partial<ProjectCreation> = {
            title: e.target.title.value,
            description: e.target.description.value,
        };

        if (selectedFile) {
            body.poster = await getBase64(selectedFile, 686, 1016);
        }

        const res = await fetch(`/api/users/${user?.id}/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const json = await res.json();
        if (res.status === 201) {
            setIsCreating(false);
            Router.push("/");
        } else {
            setFormInfo({ content: json.message, isError: true });
        }
    };

    return (
        <div className="project-form-container">
            <form className="project-form" onSubmit={onSubmit}>
                <div>
                    <h1>New project</h1>
                    {formInfo && <FormInfo info={formInfo} />}
                    <hr />
                </div>

                <div>
                    <div className="form-element">
                        <span className="form-label">Title</span>
                        <input
                            id="project-title-input"
                            className="form-input"
                            name="title"
                            required
                        />
                        <span className="form-label">
                            Description - <i>optional</i>
                        </span>
                        <textarea
                            id="project-description-input"
                            className="form-input input-description"
                            name="description"
                        />
                        <span className="form-label">
                            Poster - <i>optional</i>
                        </span>
                        <UploadButton
                            setSelectedFile={setSelectedFile}
                            selectedFile={selectedFile}
                        />
                    </div>
                </div>

                <div className="project-form-end">
                    <button
                        className="form-btn back-btn"
                        onClick={exitCreating}
                    >
                        Back
                    </button>
                    <button
                        className="form-btn project-form-submit-btn"
                        type="submit"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewProjectPage;
