'use client';

import SMSForm from "@/components/smsform";
import { useSession } from "next-auth/react";

export default function SMSPage() {
  const { data: session } = useSession();
  return (
    <SMSForm />
  )
}