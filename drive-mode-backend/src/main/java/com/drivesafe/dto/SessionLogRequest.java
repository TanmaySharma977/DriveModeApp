package com.drivesafe.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionLogRequest {
    private String event; // start, end, pause
    private LocalDateTime timestamp;
}