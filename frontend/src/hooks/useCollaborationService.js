import { useEffect, useState, useRef } from "react";
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
    });

    const joinRoom = (roomId) => {
        setCollabState((prevState) => {
            return { ...prevState, roomId };
        });
        socketRef.current.emit("joinRoom", {roomId})
    }


    const emitOutgoingChanges = (data) => {
        socketRef.current.emit("outgoingChanges", {roomId: collabState.roomId, data})
        setCollabState((prevState) => {
            return { ...prevState, data };
        });
    }

    const updateOnIncommingChanges = (data) => {
        setCollabState((prevState) => {
            return { ...prevState, data };
        });
    }

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
            updateOnIncommingChanges(data)
        });

        socketRef.current = socket;

        return () => socket.disconnect();
    }, [enabled, onConnected, onDisconnected]);

    return { joinRoom, emitOutgoingChanges, disconnect, collabState };
};
