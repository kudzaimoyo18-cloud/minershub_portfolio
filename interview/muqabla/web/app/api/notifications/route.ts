import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .eq("channel", "in_app")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch notifications" },
        { status: 500 }
      );
    }

    // Also get unread count
    const { count: unreadCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("channel", "in_app")
      .eq("is_read", false);

    return NextResponse.json({
      notifications: data,
      total: count,
      unread_count: unreadCount || 0,
    });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationIds, markAllRead } = await request.json();

    if (markAllRead) {
      await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("is_read", false);
    } else if (notificationIds?.length) {
      await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .in("id", notificationIds);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
