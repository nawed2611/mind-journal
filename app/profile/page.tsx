"use client";

import { UserProfile } from "@clerk/nextjs";
import React, { useEffect, useRef, useState } from "react";

const Profile = (props: any) => {
  return (
    <div className="mb-20 mt-8 h-[75vh] overflow-scroll">
      <UserProfile />
    </div>
  );
};

export default Profile;
