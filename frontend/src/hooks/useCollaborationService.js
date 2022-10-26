import { useEffect, useState, useRef, useDebugValue } from "react";
import { io } from "socket.io-client";
import { COLLABORATION_SERVICE_ENDPOINT } from "../constants";

export const useCollaborationService = ({
    enabled,
    onConnected,
    onDisconnected,
}) => {
    const socketRef = useRef();

    const [collabState, setCollabState] = useState({
        hasConnected: false,
        data: "",
        roomId: null,
        editorMode: null,
        pushState: false,
    });

    const joinRoom = (roomId) => {
        setCollabState((prevState) => {
            return { ...prevState, roomId };
        });
        socketRef.current.emit("joinRoom", { roomId });
    };

    const emitOutgoingChanges = (data) => {
        socketRef.current.emit("outgoingChanges", {
            roomId: collabState.roomId,
            data,
        });
        setCollabState((prevState) => {
            return { ...prevState, data };
        });
    };

    const updateOnIncommingChanges = (data) => {
        setCollabState((prevState) => {
            return { ...prevState, data };
        });
    };

    const pushData = (data) => {
        socketRef.current.emit("outgoingChanges", {
            roomId: collabState.roomId,
            data,
        });
        setCollabState((prevState) => {
            return { ...prevState, pushState: false };
        });
    };

    const initCollabEditorMode = (editorMode) => {
        setCollabState((prevState) => {
            return { ...prevState, editorMode };
        });
    };

    const pushEditorMode = (editorMode) => {
        socketRef.current.emit("pushEditorMode", {
            roomId: collabState.roomId,
            data: editorMode,
        });
        setCollabState((prevState) => {
            return { ...prevState, editorMode };
        });
    };

    const updateOnIncommingEditorMode = (editorMode) => {
        setCollabState((prevState) => {
            return { ...prevState, editorMode };
        });
    };

    const setActivePushState = () => {
        setCollabState((prevState) => {
            return { ...prevState, pushState: true };
        });
    };

    const disconnect = () => {
        socketRef.current.disconnect();
    };

    const updateOnConnected = () => {
        setCollabState((prevState) => {
            return { ...prevState, hasConnected: true };
        });
    };

    const updateOnDisconnected = () => {
        setCollabState((prevState) => {
            return { ...prevState, hasConnected: false };
        });
    };

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const socket = io(COLLABORATION_SERVICE_ENDPOINT);

        socket.on("connected", () => {
            updateOnConnected();
            if (onConnected) {
                onConnected();
            }
        });

        socket.on("disconnect", () => {
            updateOnDisconnected();
            if (onDisconnected) {
                onDisconnected();
            }
        });

        socket.on("incommingChanges", ({ data }) => {
            updateOnIncommingChanges(data);
        });

        socket.on("pullData", () => {
            setActivePushState();
        });

        socket.on("incommingEditorMode", ({ data }) => {
            updateOnIncommingEditorMode(data);
        });

        socketRef.current = socket;

        return () => socket.disconnect();
    }, [enabled, onConnected, onDisconnected]);

    return {
        joinRoom,
        emitOutgoingChanges,
        disconnect,
        pushData,
        pushEditorMode,
        initCollabEditorMode,
        collabState,
    };
};
