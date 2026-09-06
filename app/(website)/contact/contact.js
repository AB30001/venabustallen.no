"use client";

import Container from "@/components/container";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useWeb3Forms from "@web3forms/react";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";
import { SITE_NAME } from "@/lib/seo";
export default function Contact({ settings }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitSuccessful, isSubmitting }
  } = useForm({
    mode: "onTouched"
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState(false);
  const apiKey = settings?.w3ckey || process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  const { submit: onSubmit } = useWeb3Forms({
    access_key: apiKey,
    settings: {
      from_name: SITE_NAME,
      subject: `Ny kontaktmelding fra ${SITE_NAME}`
    },
    onSuccess: (msg, data) => {
      setIsSuccess(true);
      setMessage(msg);
      reset();
    },
    onError: (msg, data) => {
      setIsSuccess(false);
      setMessage(msg);
    }
  });

  return (
    <Container>
      <h1 className="heading-display text-center">
        Kontakt
      </h1>
      <div className="mt-4 text-center">
        <p className="font-serif text-lg italic text-muted">Vi hjelper deg gjerne med spørsmål om ridning og opphold.</p>
      </div>

      <div className="my-12 grid gap-10 md:grid-cols-2">
        <div className="md:py-6">
          <h2 className="heading-section">
            Kontakt {SITE_NAME}
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-ink">
            Har du spørsmål om rideturer eller rideferier? Fyll ut skjemaet
            eller send oss en e-post.
          </p>

          <div className="mt-5">
            <div className="mt-2 flex items-center space-x-2 text-muted">
              <EnvelopeIcon className="h-4 w-4" />
              <a
                href="mailto:info@venebustallen.no"
                className="text-accent hover:underline">
                info@venebustallen.no
              </a>
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="my-4">
            <input
              type="checkbox"
              id=""
              className="hidden"
              style={{ display: "none" }}
              {...register("botcheck")}></input>

            <div className="mb-5">
              <input
                type="text"
                placeholder="Full Name"
                autoComplete="false"
                className={`w-full border bg-paper px-4 py-3 font-sans outline-none transition focus:ring-2 ${
                  errors.name
                    ? "border-red-600 ring-red-100"
                    : "border-line focus:border-charcoal focus:ring-mist"
                }`}
                {...register("name", {
                  required: "Full name is required",
                  maxLength: 80
                })}
              />
              {errors.name && (
                <div className="mt-1 text-red-600">
                  <small>{errors.name.message}</small>
                </div>
              )}
            </div>

            <div className="mb-5">
              <label htmlFor="email_address" className="sr-only">
                Email Address
              </label>
              <input
                id="email_address"
                type="email"
                placeholder="Email Address"
                name="email"
                autoComplete="false"
                className={`w-full border bg-paper px-4 py-3 font-sans outline-none transition focus:ring-2 ${
                  errors.email
                    ? "border-red-600 ring-red-100"
                    : "border-line focus:border-charcoal focus:ring-mist"
                }`}
                {...register("email", {
                  required: "Enter your email",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Please enter a valid email"
                  }
                })}
              />
              {errors.email && (
                <div className="mt-1 text-red-600">
                  <small>{errors.email.message}</small>
                </div>
              )}
            </div>

            <div className="mb-3">
              <textarea
                name="message"
                placeholder="Your Message"
                className={`h-36 w-full border bg-paper px-4 py-3 font-sans outline-none transition focus:ring-2 ${
                  errors.message
                    ? "border-red-600 ring-red-100"
                    : "border-line focus:border-charcoal focus:ring-mist"
                }`}
                {...register("message", {
                  required: "Enter your Message"
                })}
              />
              {errors.message && (
                <div className="mt-1 text-red-600">
                  {" "}
                  <small>{errors.message.message}</small>
                </div>
              )}
            </div>

            <button type="submit" className="btn-pill-accent w-full !rounded-full py-3.5">
              {isSubmitting ? (
                <svg
                  className="mx-auto h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Send Message"
              )}
            </button>
          </form>

          {isSubmitSuccessful && isSuccess && (
            <div className="mt-3 text-sm text-center text-green-500">
              {message || "Success. Message sent successfully"}
            </div>
          )}
          {isSubmitSuccessful && !isSuccess && (
            <div className="mt-3 text-sm text-center text-red-500">
              {message || "Something went wrong. Please try later."}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
