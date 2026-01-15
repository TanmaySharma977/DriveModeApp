package com.drivesafe.repository;

import com.drivesafe.model.DriveSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriveSessionRepository extends JpaRepository<DriveSession, Long> {
    List<DriveSession> findByUserIdOrderByStartTimeDesc(Long userId);

    Optional<DriveSession> findByUserIdAndStatus(Long userId, String status);

    @Query("SELECT d FROM DriveSession d WHERE d.userId = :userId AND d.status = 'ACTIVE'")
    Optional<DriveSession> findActiveSessionByUserId(Long userId);
}