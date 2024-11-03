package com.webtech.MadeleineGarden.repository;

import com.webtech.MadeleineGarden.model.Admin;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);

    List<Admin> findByEmailContaining(String email, Pageable pageable);

    List<Admin> findByFirstNameContainingOrLastNameContaining(
            String firstName, String lastName, Pageable pageable);

    List<Admin> findByEmailContainingAndFirstNameContainingOrLastNameContaining(
            String email, String firstName, String lastName, Pageable pageable);
}