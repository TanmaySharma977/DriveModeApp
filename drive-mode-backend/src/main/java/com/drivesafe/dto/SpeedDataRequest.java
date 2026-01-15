package com.drivesafe.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SpeedDataRequest {
    private Double speed;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;
}