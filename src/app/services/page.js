"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";

import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Activity,
  Award,
  Zap,
  CheckCircle2,
  PhoneCall,
  FileCheck,
  Cpu,
} from "lucide-react";

// ============================================================
// STATIC WORKFLOW CONTENT
// This is NOT service catalog data.
// Services themselves come only from Firebase.
// ============================================================
const workflowSteps = [
  {
    step: "01",
    title: "Diagnostic Audit & Consultation",
    desc: "We analyze your hospital sample load, space constraints, and technical requirements to select the exact analyzer configuration.",
    icon: FileCheck,
  },
  {
    step: "02",
    title: "Precision Solution Engineering",
    desc: "Custom lab layout designs, power backup specifications, and reagent supply schedule formulation.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Installation & NABL Calibration",
    desc: "Certified engineers perform physical installation, IQ/OQ/PQ protocols, and NABL-traceable reference calibration.",
    icon: Award,
  },
  {
    step: "04",
    title: "24/7 SLA Field Maintenance",
    desc: "Round-the-clock technical emergency support, scheduled preventive maintenance visits, and automated reagent restocking.",
    icon: Zap,
  },
];

export default function ServicesPage() {
  // ============================================================
  // SERVICES ARE FIREBASE ONLY
  // NO FALLBACK SERVICES
  // ============================================================
  const [services, setServices] = useState([]);

  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  // ============================================================
  // DYNAMIC LINK HELPER
  // ============================================================
  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  // ============================================================
  // STATIC ICONS
  // Service title & description are dynamic from Firebase.
  // ============================================================
  const icons = [
    <Microscope size={28} key={1} />,
    <FlaskConical size={28} key={2} />,
    <ShieldCheck size={28} key={3} />,
    <Stethoscope size={28} key={4} />,
    <Wrench size={28} key={5} />,
    <Activity size={28} key={6} />,
  ];

  // ============================================================
  // FETCH SERVICES + CONTACT
  // ============================================================
  useEffect(() => {
    const fetchServicesAndContact = async () => {
      try {
        const [servicesSnap, contactSnap] =
          await Promise.all([
            getDoc(
              doc(
                db,
                "websites",
                "rajvedcom",
                "pages",
                "services"
              )
            ),

            getDoc(
              doc(
                db,
                "websites",
                "rajvedcom",
                "pages",
                "contact"
              )
            ),
          ]);

        // ======================================================
        // SERVICES - FIREBASE ONLY
        // ======================================================
        if (servicesSnap.exists()) {
          const firebaseServices =
            servicesSnap.data().services;

          if (
            Array.isArray(firebaseServices) &&
            firebaseServices.length > 0
          ) {
            const dbServices =
              firebaseServices
                .map((service, index) => ({
                  id:
                    service?.id ||
                    `service-${index}`,

                  // Admin field
                  title:
                    typeof service?.title ===
                      "string"
                      ? service.title.trim()
                      : "",

                  // Admin field
                  desc:
                    typeof service?.desc ===
                      "string"
                      ? service.desc.trim()
                      : "",
                }))
                // Only show services having title
                // or description
                .filter(
                  (service) =>
                    service.title ||
                    service.desc
                );

            setServices(dbServices);
          } else {
            // Firebase exists but has no services
            setServices([]);
          }
        } else {
          // Firebase document does not exist
          setServices([]);
        }

        // ======================================================
        // CONTACT - FIREBASE ONLY
        // ======================================================
        if (contactSnap.exists()) {
          setContactInfo(
            contactSnap.data().contactInfo || []
          );
        } else {
          setContactInfo([]);
        }
      } catch (error) {
        console.error(
          "Error loading services/contact data:",
          error
        );

        // IMPORTANT:
        // Never load fallback services.
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesAndContact();
  }, []);

  // ============================================================
  // DYNAMIC EMERGENCY HELPLINE PHONE
  // ============================================================
  const emergencyPhone = (() => {
    const item = contactInfo.find((c) => {
      const label = (
        c?.label || ""
      ).toLowerCase();

      return (
        label.includes("phone") ||
        label.includes("mobile") ||
        label.includes("helpline") ||
        label.includes("emergency") ||
        label.includes("tel") ||
        label.includes("contact")
      );
    });

    if (!item) return "";

    if (Array.isArray(item.value)) {
      return item.value[0] || "";
    }

    return typeof item.value === "string"
      ? item.value.trim()
      : "";
  })();

  return (
    <div className="bg-[#FFF9F8] text-[#2D1818]">

      {/* ========================================================
          BANNER
      ======================================================== */}
      <PageBanner
        badge="Technical Services"
        title="Biomedical Support From Setup to Service"
        subtitle="NABL-certified calibration, 2-hour emergency repair SLAs, cold-chain reagent distribution, and turnkey pathology setup."
      />

      {/* ========================================================
          SERVICES GRID
      ======================================================== */}
      <section className="section-padding bg-gradient-to-b from-white via-[#FFF9F8] to-[#FFF0EF]">
        <div className="container-custom">

          <SectionTitle
            badge="Full Service Catalog"
            title="Designed Around Reliable Operations"
            description="Explore our specialized services designed to keep clinical laboratories and hospital departments operating at peak accuracy."
            center
          />

          {/* ======================================================
              LOADING STATE
          ====================================================== */}
          {loading ? (
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 rounded-3xl border border-[#FBD5D3] bg-white animate-pulse shadow-sm"
                />
              ))}

            </div>
          ) : services.length > 0 ? (

            /* ====================================================
               DYNAMIC SERVICES FROM FIREBASE
               ==================================================== */
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {services.map(
                (service, index) => (
                  <ServiceCard
                    key={
                      service.id ||
                      index
                    }

                    icon={
                      icons[
                      index %
                      icons.length
                      ]
                    }

                    title={
                      service.title
                    }

                    description={
                      service.desc
                    }

                    makeLink={
                      makeLink
                    }
                  />
                )
              )}

            </div>

          ) : (

            /* ====================================================
               NO SERVICE STATE
               ==================================================== */
            <div className="mt-16 flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-[#E9B8B5] bg-white px-6 text-center shadow-sm">

              <div>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0EF] text-[#E05353] border border-[#FBD5D3]">
                  <Wrench size={30} />
                </div>

                <h3 className="text-2xl font-bold text-[#2D1818]">
                  No Services Available
                </h3>

                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#796565]">
                  No services have been added
                  from the admin panel yet.
                  Please check back later.
                </p>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          WORKFLOW PROCESS
          Static informational section - unchanged.
      ======================================================== */}
      <section className="section-padding bg-white border-y border-[#FBD5D3]/60">
        <div className="container-custom">

          <SectionTitle
            badge="Execution Framework"
            title="Our 4-Step Engineering Workflow"
            description="A systematic process ensuring seamless integration, rapid compliance, and long-term instrument reliability."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {workflowSteps.map(
              (step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={index}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#FBD5D3] bg-[#FFF0EF] p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#E05353] hover:shadow-xl"
                  >

                    <div>

                      <div className="flex items-center justify-between">

                        <span className="text-4xl font-black text-[#E05353]/35 group-hover:text-[#E05353] transition-colors">
                          {step.step}
                        </span>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#E05353] shadow-sm">
                          <Icon size={24} />
                        </div>

                      </div>

                      <h3 className="mt-6 text-xl font-bold text-[#2D1818] group-hover:text-[#E05353] transition-colors">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-[#796565]">
                        {step.desc}
                      </p>

                    </div>

                    <div className="mt-6 pt-4 border-t border-[#FBD5D3]/50">
                      <span className="text-xs font-bold text-[#C93B3B]">
                        Phase {index + 1} Milestone
                      </span>
                    </div>

                  </div>
                );
              }
            )}

          </div>
        </div>
      </section>

      {/* ========================================================
          BREAKDOWN SLA BOX
      ======================================================== */}
      <section className="section-padding bg-gradient-to-b from-[#FFF0EF] via-white to-[#FFF9F8]">
        <div className="container-custom">

          <div className="rounded-3xl border border-[#FBD5D3] bg-gradient-to-r from-[#2A1414] to-[#381C1C] p-8 sm:p-12 text-white shadow-xl">

            <div className="grid lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-8">

                <span className="inline-flex items-center gap-2 rounded-full bg-[#E05353] px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-md shadow-[#E05353]/30">
                  <Zap size={14} />
                  Emergency Breakdown Helpline
                </span>

                <h3 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                  Facing an Equipment Emergency in ICU or Lab?
                </h3>

                <p className="mt-3 text-base text-[#FBD5D3] leading-relaxed">
                  Our certified field engineers are equipped with OEM diagnostic kits and genuine spare parts for instant on-site restoration.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-semibold text-white">

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      className="text-[#FF7B72]"
                    />
                    <span>
                      2-Hour On-Site SLA
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      className="text-[#FF7B72]"
                    />
                    <span>
                      Loaner Analyzer Option
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      className="text-[#FF7B72]"
                    />
                    <span>
                      NABL Re-calibration Included
                    </span>
                  </div>

                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center border-t lg:border-t-0 lg:border-l border-[#FBD5D3]/20 pt-6 lg:pt-0 lg:pl-8">

                <p className="text-xs font-bold uppercase tracking-wider text-[#FBD5D3]">
                  Emergency Dispatch
                </p>

                {emergencyPhone ? (
                  <a
                    href={`tel:${emergencyPhone.replace(
                      /\s+/g,
                      ""
                    )}`}
                    className="mt-2 text-2xl font-black text-white hover:text-[#FF7B72] transition-colors inline-block"
                  >
                    {emergencyPhone}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-[#FBD5D3]">
                    24/7 Field Dispatch Active
                  </p>
                )}

                <Link
                  href={makeLink(
                    "/contact"
                  )}
                  className="mt-5 w-full rounded-2xl bg-[#E05353] py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-[#E05353]/30 transition-all hover:bg-[#C93B3B]"
                >
                  Book Priority Repair
                </Link>

              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}