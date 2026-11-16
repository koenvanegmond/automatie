import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { MeetPage } from "@/sections/MeetPage";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Kennismaken | Appmaatje",
  description: "Gratis kennismaking. We komen langs of je appt ons.",
  alternates: { canonical: "/kennismaken" },
};

export default function KennismakenPage() {
  return (<><Header /><main><MeetPage /></main><Footer /></>);
}
