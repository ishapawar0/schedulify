"use server";

import { google } from "googleapis";
import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";



export async function createBooking(bookingData) {
  try {
    const event = await db.event.findUnique({
      where: { id: bookingData.eventId },
      include: { user: true },
    });

    if (!event) throw new Error("Event not found");

    // 1. Get Google Access Token from Clerk
    const clerk = await clerkClient();
    const tokenResponse = await clerk.users.getUserOauthAccessToken(
      event.user.clerkUserId,
      "oauth_google"
    );

    const token = tokenResponse.data[0]?.token;

    if (!token) {
      console.error("No Google OAuth token found for user!");
      throw new Error("Host Google account not connected");
    }

    // 2. Setup Google Calendar Client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // 3. Insert Event with Google Meet link enabled
    const meetEvent = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1, // REQUIRED for Google Meet Link generation!
      requestBody: {
        summary: `${bookingData.name} - ${event.title}`,
        description: bookingData.additionalInfo,
        start: { dateTime: bookingData.startTime },
        end: { dateTime: bookingData.endTime },
        attendees: [
          { email: bookingData.email },
          { email: event.user.email },
        ],
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}-${Math.random()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    const meetLink = meetEvent.data.hangoutLink;
    const googleEventId = meetEvent.data.id;

    // 4. Save Booking to Prisma Database
    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name: bookingData.name,
        email: bookingData.email,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        additionalInfo: bookingData.additionalInfo,
        meetLink: meetLink,
        googleEventId: googleEventId,
      },
    });
    revalidatePath("/dashboard");
revalidatePath("/events");
revalidatePath("/meetings");

    return { success: true, booking, meetLink };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: error.message };
  }
}