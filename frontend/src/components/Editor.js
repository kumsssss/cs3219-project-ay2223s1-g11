import { useContext, useEffect, useState } from "react";
import { useCollaborationService } from "../hooks/useCollaborationService";
import { UserContext } from "../contexts/UserContext";

import {
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
} from "@mui/material";

import AceEditor from "react-ace";

// Language modes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-elixir";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-swift";

// Themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-dracula";

import "ace-builds/src-noconflict/ext-language_tools";

const MODES = new Map();
MODES.set("Javascript", "javascript")
    .set("Java", "java")
    .set("Python", "python")
    .set("Ruby", "ruby")
    .set("Golang", "golang")
    .set("C++", "c_cpp")
    .set("Elixir", "elixir")
    .set("Rust", "rust")
    .set("Swift", "swift");

const THEMES = new Map();
THEMES.set("Monokai", "monokai")
    .set("Github", "github")
    .set("Tomorrow", "tomorrow")
    .set("Kuroir", "kuroir")
    .set("Twilight", "twilight")
    .set("Xcode", "xcode")
    .set("Solarized dark", "solarized_dark")
    .set("Solarized light", "solarized_light")
    .set("Terminal", "terminal")
    .set("Dracula", "dracula")
    .set("Monokai", "monokai")
    .set("Monokai", "monokai");

const FONT_SIZES = [14, 15, 16, 17, 18, 19, 20];

const DEFAULT_THEME = "Monokai";
const DEFAULT_MODE = "Javascript";
const DEFAULT_FONT_SIZE = 14;

const Editor = () => {
    const [editorState, setEditorState] = useState({
        mode: MODES.get(DEFAULT_MODE),
        modePlaceholder: DEFAULT_MODE,
        theme: THEMES.get(DEFAULT_THEME),
        themePlaceholder: DEFAULT_THEME,
        fontSize: DEFAULT_FONT_SIZE,
        autocomplete: true,
    });
    const [openToast, setOpenToast] = useState(false);

    const { user } = useContext(UserContext);
    const {
        joinRoom,
        emitOutgoingChanges,
        disconnect,
        pushData,
        pushEditorMode,
        initCollabEditorMode,
        collabState,
    } = useCollaborationService({ enabled: true });

    const changeMode = (e) => {
        setEditorState((prevState) => {
            return {
                ...prevState,
                mode: MODES.get(e.target.value),
                modePlaceholder: e.target.value,
            };
        });
        pushEditorMode(e.target.value);
    };

    const changeTheme = (e) => {
        setEditorState((prevState) => {
            return {
                ...prevState,
                theme: THEMES.get(e.target.value),
                themePlaceholder: e.target.value,
            };
        });
    };

    const changeFontSize = (e) => {
        setEditorState((prevState) => {
            return {
                ...prevState,
                fontSize: e.target.value,
            };
        });
    };

    const changeAutocomplete = (e) => {
        setEditorState((prevState) => {
            return {
                ...prevState,
                autocomplete: e.target.checked,
            };
        });
    };

    const onEditorChange = (value, viewUpdate) => {
        emitOutgoingChanges(value);
    };

    useEffect(() => {
        // Runs when the component unmounts
        return () => disconnect();
    }, []);

    useEffect(() => {
        joinRoom(user.room);
    }, [user.room]);

    useEffect(() => {
        if (collabState.pushState) {
            pushData(collabState.data);
        }
    }, [collabState.pushState]);

    useEffect(() => {
        if (collabState.editorMode === null) {
            initCollabEditorMode(editorState.modePlaceholder)
        } else if (editorState.modePlaceholder !== collabState.editorMode) {
            setOpenToast(true);
            setEditorState((prevState) => {
                return {
                    ...prevState,
                    mode: MODES.get(collabState.editorMode),
                    modePlaceholder: collabState.editorMode,
                };
            });
        }
    }, [collabState.editorMode]);

    return (
        <>
            <FormControl>
                <InputLabel id="editor-mode-label">Language</InputLabel>
                <Select
                    labelId="editor-mode-label"
                    id="editor-mode-select"
                    value={editorState.modePlaceholder}
                    label="Language"
                    onChange={changeMode}
                >
                    {Array.from(MODES, ([key, value]) => {
                        return <MenuItem value={key}>{key}</MenuItem>;
                    })}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel id="editor-theme-label">Theme</InputLabel>
                <Select
                    labelId="editor-theme-label"
                    id="editor-theme-select"
                    value={editorState.themePlaceholder}
                    label="Theme"
                    onChange={changeTheme}
                >
                    {Array.from(THEMES, ([key, value]) => {
                        return <MenuItem value={key}>{key}</MenuItem>;
                    })}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel id="editor-font-size-label">Font size</InputLabel>
                <Select
                    labelId="editor-font-size-label"
                    id="editor-font-size-select"
                    defaultValue=""
                    value={editorState.fontSize}
                    label="Font size"
                    onChange={changeFontSize}
                >
                    {FONT_SIZES.map((value) => {
                        return <MenuItem value={value}>{value}</MenuItem>;
                    })}
                </Select>
            </FormControl>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            defaultChecked
                            value={editorState.autocomplete}
                            onChange={changeAutocomplete}
                        />
                    }
                    label="Enable Autocomplete"
                />
            </FormGroup>
            <AceEditor
                mode={editorState.mode}
                theme={editorState.theme}
                onChange={onEditorChange}
                name="editor"
                fontSize={editorState.fontSize}
                value={collabState.data}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                    enableBasicAutocompletion: editorState.autocomplete,
                    enableLiveAutocompletion: editorState.autocomplete,
                    enableSnippets: editorState.autocomplete,
                    showLineNumbers: true,
                }}
            />
            <Snackbar
                open={openToast}
                autoHideDuration={3000}
                message="Editor language updated"
                onClose={() => setOpenToast(false)}
            />
        </>
    );
};

export default Editor;
