import EditorTab from "../EditorTab";
import styles from "./EditorSidebar.module.css";

type Props = {
    tabs: any[];
    selectedTab: number;
    setActiveTab: (activeTab: string) => void;
    toggleBold: () => void;
    toggleItalic: () => void;
    toggleUnderline: () => void;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
};

type EditorStyleProps = {
    isActive: boolean;
    toggle: () => void;
    icon: string;
};

const EditorStyle = ({ isActive, toggle, icon }: EditorStyleProps) => {
    return (
        <div
            className={styles.style_btn + (isActive ? " " + styles.active_style : "")}
            onClick={toggle}
        >
            <img className={styles.style_img} src={"/images/" + icon} alt="Editor style icon" />
        </div>
    );
};

const EditorSidebarFormat = ({
    tabs,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    isBold,
    isItalic,
    isUnderline,
    selectedTab,
    setActiveTab,
}: Props) => {
    return (
        <div className={styles.sidebar + " " + styles.tabs}>
            <div className={styles.tabs}>
                <div className={styles.style_btns}>
                    <EditorStyle isActive={isBold} toggle={toggleBold} icon={"bold.png"} />
                    <EditorStyle isActive={isItalic} toggle={toggleItalic} icon={"italic.png"} />
                    <EditorStyle
                        isActive={isUnderline}
                        toggle={toggleUnderline}
                        icon={"underline.png"}
                    />
                </div>
                <EditorTab
                    action={() => setActiveTab("scene")}
                    content="SCENE HEADING"
                    active={tabs[selectedTab] == "scene"}
                />
                <EditorTab
                    action={() => setActiveTab("action")}
                    content="Action"
                    active={tabs[selectedTab] == "action"}
                />
                <EditorTab
                    action={() => setActiveTab("character")}
                    content="CHARACTER"
                    active={tabs[selectedTab] == "character"}
                />
                <EditorTab
                    action={() => setActiveTab("dialogue")}
                    content="Dialogue"
                    active={tabs[selectedTab] == "dialogue"}
                />
                <EditorTab
                    action={() => setActiveTab("parenthetical")}
                    content="(Parenthetical)"
                    active={tabs[selectedTab] == "parenthetical"}
                />
                <EditorTab
                    action={() => setActiveTab("transition")}
                    content="TRANSITION:"
                    active={tabs[selectedTab] == "transition"}
                />
                <EditorTab
                    action={() => setActiveTab("section")}
                    content="Section"
                    active={tabs[selectedTab] == "section"}
                />
                <EditorTab
                    action={() => setActiveTab("note")}
                    content="[[Note]]"
                    active={tabs[selectedTab] == "note"}
                />
            </div>
        </div>
    );
};

export default EditorSidebarFormat;
