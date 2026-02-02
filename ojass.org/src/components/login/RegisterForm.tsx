"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
    FaCheck,
    FaCode,
    FaEnvelope,
    FaExclamationTriangle,
    FaEye,
    FaEyeSlash,
    FaInfoCircle,
    FaLock,
    FaMapMarkerAlt,
    FaPhone,
    FaUniversity,
    FaUser,
} from "react-icons/fa";
import { useLoginTheme } from "./theme";
import { Button, Card, Input, Select } from "./UI";

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
    const router = useRouter();
    const theme = useLoginTheme();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        gender: "",
        city: "",
        state: "",
        collegeName: "",
        referralCode: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [hasPendingTeamJoin, setHasPendingTeamJoin] = useState(false);
    const [showEmailTooltip, setShowEmailTooltip] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("pendingTeamJoin"))
            setHasPendingTeamJoin(true);
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Crypto-keys (passwords) do not match");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const payload = {
                name: formData.username,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                gender: formData.gender,
                city: formData.city,
                state: formData.state,
                collegeName: formData.email.endsWith("@nitjsr.ac.in")
                    ? undefined
                    : formData.collegeName,
                referralCode: formData.referralCode || undefined,
            };

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setSuccess("Registered Successfully. Redirecting...");

                const pendingTeamJoin = localStorage.getItem("pendingTeamJoin");
                if (pendingTeamJoin) {
                    localStorage.removeItem("pendingTeamJoin");
                    setTimeout(
                        () => router.push(`/teams/join/${pendingTeamJoin}`),
                        1500,
                    );
                } else setTimeout(() => router.push("/dashboard"), 1500);
            } else setError(data.error || "Registration failed");
        } catch {
            setError("Network communication failure.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            active
            className="w-full max-w-xl mx-auto h-[80vh] top-[5vh] overflow-y-scroll">
            <div className="text-center mb-6">
                <h2
                    className={cn(
                        "text-2xl font-bold tracking-widest",
                        theme.textColor,
                        theme.textGlow,
                    )}>
                    NEW REGISTRATION
                </h2>
                <p className="text-slate-400 text-xs mt-2 uppercase tracking-wide">
                    Enter details to register in OJASS
                </p>
            </div>

            <form
                onSubmit={handleRegister}
                className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hasPendingTeamJoin && (
                    <div
                        className={cn(
                            "md:col-span-2 p-3 border text-sm flex items-center gap-2 animate-pulse mb-4",
                            theme.accentBgDim,
                            theme.borderColor,
                            theme.accentColor,
                        )}>
                        <FaExclamationTriangle />
                        <span>
                            You have a pending team invitation. Please register
                            to proceed.
                        </span>
                    </div>
                )}

                <Input
                    name="username"
                    label="Full Name"
                    placeholder="Enter Name"
                    value={formData.username}
                    onChange={handleChange}
                    icon={<FaUser />}
                    required
                />

                <div className="relative">
                    <div className="absolute right-0 top-0 z-5">
                        <button
                            type="button"
                            onMouseEnter={() => setShowEmailTooltip(true)}
                            onMouseLeave={() => setShowEmailTooltip(false)}
                            onClick={() =>
                                setShowEmailTooltip(!showEmailTooltip)
                            }
                            className="p-1">
                            <FaInfoCircle className="text-xs text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors" />
                        </button>
                        {showEmailTooltip && (
                            <div className="absolute right-0 top-6 w-48 p-2 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300 shadow-lg z-20">
                                If you are from NIT Jamshedpur, use your college
                                email id.
                            </div>
                        )}
                    </div>
                    <Input
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        icon={<FaEnvelope />}
                        required
                    />
                </div>

                <Input
                    name="phone"
                    type="tel"
                    label="Phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10),
                        }))
                    }
                    icon={<FaPhone />}
                    required
                />

                <Select
                    name="gender"
                    label="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </Select>

                <Input
                    name="city"
                    label="City"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    icon={<FaMapMarkerAlt />}
                    required
                />

                <Select
                    name="state"
                    label="State"
                    value={formData.state}
                    onChange={handleChange}
                    required>
                    <option value="">Select State/UT</option>
                    {/* States */}
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    {/* Union Territories */}
                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                </Select>

                {!formData.email.endsWith("@nitjsr.ac.in") && (
                    <div className="md:col-span-2">
                        <Input
                            name="collegeName"
                            label="Affiliated Institution"
                            placeholder="College Name"
                            value={formData.collegeName}
                            onChange={handleChange}
                            icon={<FaUniversity />}
                            required
                        />
                    </div>
                )}

                <div className="md:col-span-2">
                    <Input
                        name="referralCode"
                        label="Referral Code (Optional)"
                        placeholder="OJASSXXXXXX"
                        value={formData.referralCode}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                referralCode: e.target.value.toUpperCase(),
                            }))
                        }
                        icon={<FaCode />}
                    />
                </div>

                <div className="relative">
                    <Input
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        icon={<FaLock />}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn(
                            "absolute right-3 top-[36.5px] opacity-50 hover:opacity-100 transition-colors",
                            theme.accentColor,
                        )}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div className="relative">
                    <Input
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        icon={<FaLock />}
                        required
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={cn(
                            "absolute right-3 top-[36.5px] opacity-50 hover:opacity-100 transition-colors",
                            theme.accentColor,
                        )}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div className="md:col-span-2 mt-4 space-y-4">
                    {error && (
                        <div className="p-2 bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-mono flex justify-center items-center gap-2">
                            <FaExclamationTriangle className="size-3" />
                            <span>ERROR: {error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="p-2 bg-green-500/10 border border-green-500/50 text-green-400 text-sm font-mono flex justify-center items-center gap-2">
                            <FaCheck className="size-3" />
                            <span>SUCCESS: {success}</span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full text-lg">
                        Register
                    </Button>
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent w-full" />
                        <Button
                            type="button"
                            className="text-xs"
                            onClick={onSwitchToLogin}>
                            Back to Login
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
};
