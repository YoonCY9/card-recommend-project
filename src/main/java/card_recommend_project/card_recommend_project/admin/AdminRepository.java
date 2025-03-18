package card_recommend_project.card_recommend_project.admin;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin,Long> {
    Admin findByLoginId(String userId);
}
