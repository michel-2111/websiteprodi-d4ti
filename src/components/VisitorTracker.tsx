"use client";

import { useEffect, useRef } from "react";
import { catatKunjungan } from "@/src/app/actions/pengunjung";

export default function VisitorTracker() {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!hasTracked.current) {
            catatKunjungan();
            hasTracked.current = true;
        }
    }, []);

    return null;
}