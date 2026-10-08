"use client";
import { Suspense } from "react";
import { useParams } from "next/navigation";

function ProfileContent() {
    const params = useParams();
    const id = params?.id;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr />
            <p className="text-4xl">
                Profile page{" "}
                <span className="p-2 ml-2 rounded bg-orange-500 text-black">
                    {id}
                </span>
            </p>
        </div>
    );
}

export default function UserProfile() {
    return (
        <Suspense fallback={<p>Loading profile...</p>}>
            <ProfileContent />
        </Suspense>
    );
}