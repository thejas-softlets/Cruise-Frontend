"use client";

import { Crown, Info, ShieldCheck, UserCheck, Baby } from "lucide-react";
import {
  type CabinSlot,
  type GuestField,
  COUNTRIES_LIST,
  MONTHS_LIST,
  DAYS_LIST,
  ADULT_YEARS,
  CHILD_YEARS,
} from "./booking-types";
import type { DeckCabinSpot } from "@/lib/vessel-deck-plan";
import {
  calculateAge,
  determineAgeCategoryFromDob,
  checkIsMalaysian,
} from "@/lib/booking-pricing";

interface Step2PersonalDetailsProps {
  /** Booking mode: individual cabin vs full vessel charter */
  isCharter?: boolean;
  /** Active cabin slots */
  cabinSlots: CabinSlot[];
  /** Guest fields state: dictionary keyed by cabinId */
  cabinGuests: Record<string, GuestField[]>;
  /** Update helper for guest field */
  onUpdateGuest: (
    cabinId: string,
    guestIdx: number,
    field: keyof GuestField,
    value: string
  ) => void;
  /** All cabin spots across vessels */
  allCabinSpots: DeckCabinSpot[];
  /** Departure date object for age calculation */
  departureDate: Date;
  /** Special requests text */
  specialRequests: string;
  onSpecialRequestsChange: (val: string) => void;
  /** Terms agreement boolean */
  agreeTerms: boolean;
  onAgreeTermsChange: (val: boolean) => void;
}

/**
 * Step 2: Passenger Manifest & Personal Details Form
 *
 * Implements critical operational requirements:
 * 1. Adult Country of Residence: Sourced for every adult to determine attraction ticket
 *    pricing (Domestic RM 40 vs Foreigner RM 70) and evaluate cabin-scoped Tourism Tax (TTx).
 * 2. Child Date of Birth: Sourced for every child to drive backend age categorization
 *    (Infant < 2 yrs FOC, Toddler 2-3 yrs, Child 4-11 yrs 50%, Adult 12+).
 * 3. Grouped cleanly by stateroom for multi-cabin bookings.
 */
export function Step2PersonalDetails({
  isCharter = false,
  cabinSlots,
  cabinGuests,
  onUpdateGuest,
  allCabinSpots,
  departureDate,
  specialRequests,
  onSpecialRequestsChange,
  agreeTerms,
  onAgreeTermsChange,
}: Step2PersonalDetailsProps) {
  // ==========================================
  // CHARTER MODE REGISTRATION FORM
  // ==========================================
  if (isCharter) {
    const leadGuest = cabinGuests["cabin-1"]?.[0] || {
      firstName: "",
      lastName: "",
      email: "",
      country: "Malaysia",
      phoneCode: "+60",
      phoneNumber: "",
      dobMonth: "May",
      dobDay: "14",
      dobYear: "1988",
      membershipNumber: "",
    };

    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
            <Crown className="size-4 fill-amber-500 text-amber-500" />
            Private Vessel Buyout Registration
          </span>
          <h2 className="mt-1 font-display text-3xl font-medium text-ink">
            Charterer &amp; Organization Details
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Please provide primary contact information for the charter contract and port authority maritime manifest clearance.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-ink/10 pb-4">
            <h3 className="font-display text-xl font-medium text-ink">
              Lead Charterer (Primary Contact)
            </h3>
            <p className="text-[11px] text-text-muted">Fields marked with * are required</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">First name*</label>
              <input
                type="text"
                value={leadGuest.firstName}
                onChange={(e) => onUpdateGuest("cabin-1", 0, "firstName", e.target.value)}
                placeholder="e.g. Alexander"
                className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Last name*</label>
              <input
                type="text"
                value={leadGuest.lastName}
                onChange={(e) => onUpdateGuest("cabin-1", 0, "lastName", e.target.value)}
                placeholder="e.g. Tan"
                className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Email address*</label>
              <input
                type="email"
                value={leadGuest.email}
                onChange={(e) => onUpdateGuest("cabin-1", 0, "email", e.target.value)}
                placeholder="alexander.tan@example.com"
                className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Contact Number*</label>
              <div className="flex gap-2">
                <select
                  value={leadGuest.phoneCode}
                  onChange={(e) => onUpdateGuest("cabin-1", 0, "phoneCode", e.target.value)}
                  className="w-24 rounded-xl border border-ink/20 bg-white px-2 py-2.5 text-sm font-medium focus:outline-none"
                >
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c.name} value={c.code}>
                      {c.code} ({c.name.slice(0, 3)})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={leadGuest.phoneNumber}
                  onChange={(e) => onUpdateGuest("cabin-1", 0, "phoneNumber", e.target.value)}
                  placeholder="12-345 6789"
                  className="flex-1 rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">
              Company / Organization / Family Group Name (Optional)
            </label>
            <input
              type="text"
              value={leadGuest.membershipNumber}
              onChange={(e) => onUpdateGuest("cabin-1", 0, "membershipNumber", e.target.value)}
              placeholder="e.g. Apex Global / Tan Family Reunion"
              className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">
              Special Charter Requests &amp; Bespoke Itinerary Needs
            </label>
            <textarea
              rows={3}
              value={specialRequests}
              onChange={(e) => onSpecialRequestsChange(e.target.value)}
              placeholder="e.g. VIP barbecue grill on observation deck, bespoke sunset cocktail hour, private naturalist lectures..."
              className="w-full rounded-xl border border-ink/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
            />
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-[#FAFAF8] p-4 text-xs">
            <input
              type="checkbox"
              id="charter-terms"
              checked={agreeTerms}
              onChange={(e) => onAgreeTermsChange(e.target.checked)}
              className="mt-0.5 size-4 rounded accent-teal-deep"
            />
            <label htmlFor="charter-terms" className="text-text-muted cursor-pointer">
              I confirm that I have reviewed the vessel charter policy, full-vessel buyout regulations, and agree to submit the final passenger manifest 7 days prior to departure.
            </label>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MULTI-CABIN EXPEDITION GUEST DETAILS FORM
  // ==========================================
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-display text-3xl font-medium text-ink">Personal Details</h2>
        <p className="mt-1 text-xs text-text-muted">
          Please enter guest details for each stateroom. Fields marked with * are required for maritime manifest registration and port authority clearance.
        </p>
      </div>

      {/* Forms Grouped by Cabin */}
      {cabinSlots.map((slot, cabinIdx) => {
        const assignedSpot = allCabinSpots.find((s) => s.id === slot.selectedSpotId);
        const cabinId = slot.id;
        const guestsInThisCabin = cabinGuests[cabinId] || [];

        return (
          <div
            key={slot.id}
            className="space-y-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
          >
            {/* Cabin Heading */}
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <h3 className="font-display text-xl font-medium text-ink">
                  Cabin {cabinIdx + 1}
                  {assignedSpot && (
                    <span className="ml-2 font-sans text-sm font-normal text-teal-deep">
                      ({assignedSpot.name} · {assignedSpot.planLabel})
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-text-muted">
                  {slot.adults} Adult{slot.adults > 1 ? "s" : ""}
                  {slot.children > 0 && ` + ${slot.children} Child${slot.children > 1 ? "ren" : ""}`}
                </p>
              </div>

              <span className="rounded-full bg-teal-soft/20 px-3 py-1 text-[11px] font-bold text-teal-deep uppercase tracking-wider">
                Stateroom {assignedSpot?.planLabel ?? `${cabinIdx + 1}`}
              </span>
            </div>

            {/* ADULTS IN THIS CABIN */}
            <div className="space-y-6">
              {Array.from({ length: slot.adults }).map((_, adultIdx) => {
                const guest = guestsInThisCabin[adultIdx] || {
                  firstName: "",
                  lastName: "",
                  email: "",
                  country: "Malaysia",
                  phoneCode: "+60",
                  phoneNumber: "",
                  dobMonth: "May",
                  dobDay: "14",
                  dobYear: "1990",
                  membershipNumber: "",
                };

                const isLeadGuest = cabinIdx === 0 && adultIdx === 0;
                const isMy = checkIsMalaysian(guest.country);

                return (
                  <div
                    key={`adult-${adultIdx}`}
                    className="space-y-4 rounded-2xl border border-ink/8 bg-[#FAFAF8] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-deep flex items-center gap-1.5">
                        <UserCheck className="size-3.5" />
                        Adult {adultIdx + 1} {isLeadGuest ? "(Lead Passenger)" : ""}
                      </span>

                      {/* Nationality Ticket & Tax Status Badge */}
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isMy
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isMy
                          ? "Domestic (RM40 Ticket · TTx Exempt)"
                          : "Foreigner (RM70 Ticket + TTx RM10/n)"}
                      </span>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-text-muted">
                          First name*
                        </label>
                        <input
                          type="text"
                          value={guest.firstName}
                          onChange={(e) =>
                            onUpdateGuest(cabinId, adultIdx, "firstName", e.target.value)
                          }
                          placeholder="e.g. Alexander"
                          className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-text-muted">
                          Last name*
                        </label>
                        <input
                          type="text"
                          value={guest.lastName}
                          onChange={(e) =>
                            onUpdateGuest(cabinId, adultIdx, "lastName", e.target.value)
                          }
                          placeholder="e.g. Tan"
                          className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                        />
                      </div>
                    </div>

                    {/* Country of Residence & Contact */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* CRITICAL: COUNTRY OF RESIDENCE FOR EVERY ADULT */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-text-muted">
                          Country of Residence*
                        </label>
                        <select
                          value={guest.country || "Malaysia"}
                          onChange={(e) =>
                            onUpdateGuest(cabinId, adultIdx, "country", e.target.value)
                          }
                          className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                        >
                          {COUNTRIES_LIST.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-[10px] text-text-muted">
                          Determines attraction ticket tariff &amp; Malaysian Tourism Tax eligibility.
                        </p>
                      </div>

                      {/* Contact Phone */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-text-muted">
                          Contact Number{isLeadGuest ? "*" : " (Optional)"}
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={guest.phoneCode}
                            onChange={(e) =>
                              onUpdateGuest(cabinId, adultIdx, "phoneCode", e.target.value)
                            }
                            className="w-24 rounded-xl border border-ink/20 bg-white px-2 py-2.5 text-sm font-medium focus:outline-none"
                          >
                            {COUNTRIES_LIST.map((c) => (
                              <option key={c.name} value={c.code}>
                                {c.code} ({c.name.slice(0, 3)})
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={guest.phoneNumber}
                            onChange={(e) =>
                              onUpdateGuest(cabinId, adultIdx, "phoneNumber", e.target.value)
                            }
                            placeholder="12-345 6789"
                            className="flex-1 rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email for Lead Guest */}
                    {isLeadGuest && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-text-muted">
                          Email address* (For booking confirmation &amp; official invoice)
                        </label>
                        <input
                          type="email"
                          value={guest.email}
                          onChange={(e) =>
                            onUpdateGuest(cabinId, adultIdx, "email", e.target.value)
                          }
                          placeholder="alexander.tan@example.com"
                          className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                        />
                      </div>
                    )}

                    {/* Date of Birth dropdowns for Adult */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-muted">
                        Date of birth (Adult)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={guest.dobMonth}
                          onChange={(e) =>
                            onUpdateGuest(cabinId, adultIdx, "dobMonth", e.target.value)
                          }
                          className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                        >
                          {MONTHS_LIST.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>

                        <select
                          value={guest.dobDay}
                          onChange={(e) =>
                            onUpdateGuest(cabinId, adultIdx, "dobDay", e.target.value)
                          }
                          className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                        >
                          {DAYS_LIST.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>

                        <select
                          value={guest.dobYear}
                          onChange={(e) =>
                            onUpdateGuest(cabinId, adultIdx, "dobYear", e.target.value)
                          }
                          className="rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-medium text-ink shadow-xs"
                        >
                          {ADULT_YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CHILDREN IN THIS CABIN */}
            {slot.children > 0 && (
              <div className="space-y-4 border-t border-ink/10 pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-deep flex items-center gap-1.5">
                  <Baby className="size-3.5" />
                  Child Guests ({slot.children})
                </span>

                {Array.from({ length: slot.children }).map((_, childIdx) => {
                  const guestIndex = slot.adults + childIdx;
                  const guest = guestsInThisCabin[guestIndex] || {
                    firstName: "",
                    lastName: "",
                    email: "",
                    country: "Malaysia",
                    phoneCode: "+60",
                    phoneNumber: "",
                    dobMonth: "March",
                    dobDay: "7",
                    dobYear: "2018",
                    membershipNumber: "",
                  };

                  const dobFromSlot = slot.childBirthDates[childIdx] || {
                    month: guest.dobMonth || "March",
                    day: guest.dobDay || "7",
                    year: guest.dobYear || "2018",
                  };

                  // Calculate age category automatically from DOB
                  const age = calculateAge(dobFromSlot, departureDate);
                  const category = determineAgeCategoryFromDob(dobFromSlot, departureDate);

                  return (
                    <div
                      key={`child-${childIdx}`}
                      className="space-y-4 rounded-2xl border border-teal-deep/15 bg-teal-soft/10 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-deep">
                          Child {childIdx + 1}
                        </span>

                        {/* Automatic Category Badge from Backend Logic */}
                        <span className="rounded-full bg-white px-3 py-0.5 text-xs font-bold text-teal-deep shadow-xs border border-teal-deep/20">
                          {age !== null ? `Age ${age} · ` : ""}
                          {category === "infant"
                            ? "Infant (< 2 yrs · Complimentary FOC)"
                            : category === "toddler"
                            ? "Toddler (2–3 yrs · Nominal Amenities Fee)"
                            : category === "child"
                            ? "Child (4–11 yrs · 50% Package Fare)"
                            : "Adult Fare (12+ yrs)"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-text-muted">
                            First name*
                          </label>
                          <input
                            type="text"
                            value={guest.firstName}
                            onChange={(e) =>
                              onUpdateGuest(cabinId, guestIndex, "firstName", e.target.value)
                            }
                            placeholder="Child's first name"
                            className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-text-muted">
                            Last name*
                          </label>
                          <input
                            type="text"
                            value={guest.lastName}
                            onChange={(e) =>
                              onUpdateGuest(cabinId, guestIndex, "lastName", e.target.value)
                            }
                            placeholder="Child's last name"
                            className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
                          />
                        </div>
                      </div>

                      {/* Date of Birth verification display */}
                      <div className="text-[11px] text-text-muted flex items-center gap-1.5">
                        <Info className="size-3.5 text-teal-deep" />
                        <span>
                          Sailing Date of Birth: <strong>{dobFromSlot.day} {dobFromSlot.month} {dobFromSlot.year}</strong> (Configured in Step 1)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Special Requests & Terms */}
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm space-y-4 sm:p-8">
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink">
            Special Requests &amp; Dietary Preferences (Optional)
          </label>
          <textarea
            rows={3}
            value={specialRequests}
            onChange={(e) => onSpecialRequestsChange(e.target.value)}
            placeholder="Halal artisanal cuisine, vegetarian, anniversaries, mobility assistance..."
            className="w-full rounded-xl border border-ink/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-deep/30"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => onAgreeTermsChange(e.target.checked)}
            className="mt-0.5 size-4 accent-teal-deep"
          />
          <span className="text-xs text-text-muted leading-relaxed">
            I confirm the passenger details provided are accurate for port authority clearance. I agree to Lake Kenyir National Park regulations, maritime safety protocols, and standard cruise cancellation terms.
          </span>
        </label>
      </div>
    </div>
  );
}
