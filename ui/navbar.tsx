"use client";

import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Menu from "../app/menu";

const Navbar = () => {
    return (
        <div className="flex w-full items-center justify-between px-12 mt-4">
            <div>
                <h1 className="text-4xl">MindJournal</h1>
                <p>{
                    new Date().toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                }
                </p>
            </div>
            <div className="flex gap-x-4">
                <UserButton afterSignOutUrl="/" />
                <Menu />
            </div>
        </div>
    );
};

export default Navbar;