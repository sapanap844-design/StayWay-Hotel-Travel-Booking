package com.hotelbooking.backend.dto;

import com.hotelbooking.backend.entity.Room;

/** A room plus how many of that type are still free for the chosen dates. */
public record RoomAvailability(Room room, long availableRooms) {
}
