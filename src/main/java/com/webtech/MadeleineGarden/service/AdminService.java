package com.webtech.MadeleineGarden.service;

import com.webtech.MadeleineGarden.model.Admin;
import com.webtech.MadeleineGarden.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Admin> getAllAdmins() {
        try {
            return adminRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving all admins", e);
        }
    }

    public List<Admin> searchAdmins(String email, String name, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);

            if (email != null && name != null) {
                return adminRepository.findByEmailContainingAndFirstNameContainingOrLastNameContaining(
                        email, name, name, pageable);
            } else if (email != null) {
                return adminRepository.findByEmailContaining(email, pageable);
            } else if (name != null) {
                return adminRepository.findByFirstNameContainingOrLastNameContaining(
                        name, name, pageable);
            }

            return adminRepository.findAll(pageable).getContent();
        } catch (Exception e) {
            throw new RuntimeException("Error searching admins", e);
        }
    }

    public Optional<Admin> getAdminById(Long id) {
        try {
            return adminRepository.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving admin with id: " + id, e);
        }
    }

    public Admin createAdmin(Admin admin) {
        try {
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
            return adminRepository.save(admin);
        } catch (Exception e) {
            throw new RuntimeException("Error creating admin", e);
        }
    }

    public Admin updateAdmin(Long id, Admin adminDetails) {
        try {
            return adminRepository.findById(id)
                    .map(admin -> {
                        admin.setFirstName(adminDetails.getFirstName());
                        admin.setLastName(adminDetails.getLastName());
                        admin.setEmail(adminDetails.getEmail());
                        admin.setRole(adminDetails.getRole());

                        if (adminDetails.getPassword() != null && !adminDetails.getPassword().isEmpty()) {
                            admin.setPassword(passwordEncoder.encode(adminDetails.getPassword()));
                        }

                        return adminRepository.save(admin);
                    })
                    .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Error updating admin with id: " + id, e);
        }
    }

    public void deleteAdmin(Long id) {
        try {
            adminRepository.findById(id)
                    .ifPresentOrElse(
                            adminRepository::delete,
                            () -> { throw new RuntimeException("Admin not found with id: " + id); }
                    );
        } catch (Exception e) {
            throw new RuntimeException("Error deleting admin with id: " + id, e);
        }
    }

    public Admin login(String email, String password) {
        try {
            return adminRepository.findByEmail(email)
                    .filter(admin -> passwordEncoder.matches(password, admin.getPassword()))
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        } catch (Exception e) {
            throw new RuntimeException("Error during login", e);
        }
    }
}