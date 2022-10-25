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
        output: "",
        outputError: null,
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

    const setActivePushState = () => {
        setCollabState((prevState) => {
            return { ...prevState, pushState: true };
        });
    };

    const runJavascript = () => {
        socketRef.current.emit("runJavascript", {
            roomId: collabState.roomId,
            data: collabState.data,
        });
    };

    const updateOnEvaluatedOuput = (data, error) => {
        setCollabState((prevState) => {
            return { ...prevState, output: data, outputError: error };
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

        socket.on("evaluatedOutput", ({ data, error }) => {
            updateOnEvaluatedOuput(data, error);
        });

        socket.on("pullData", () => {
            setActivePushState();
        });

        socketRef.current = socket;

        return () => socket.disconnect();
    }, [enabled, onConnected, onDisconnected]);

    return {
        joinRoom,
        emitOutgoingChanges,
        runJavascript,
        disconnect,
        pushData,
        collabState,
    };
};
