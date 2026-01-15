package com.drivesafe.repository;

import com.drivesafe.model.SpeedData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SpeedDataRepository extends JpaRepository<SpeedData, Long> {
    List<SpeedData> findBySessionIdOrderByTimestampAsc(Long sessionId);

    @Query("SELECT AVG(s.speed) FROM SpeedData s WHERE s.sessionId = :sessionId")
    Double calculateAverageSpeed(Long sessionId);

    @Query("SELECT MAX(s.speed) FROM SpeedData s WHERE s.sessionId = :sessionId")
    Double findMaxSpeed(Long sessionId);
}
