package card_recommend_project.card_recommend_project.admin;

import card_recommend_project.card_recommend_project.loginUtils.SecurityUtils;
import jakarta.persistence.*;

@Entity
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String loginId;

    @Column(nullable = false)
    private String password;

    protected Admin() {
    }

    public Admin(String loginId, String password) {
        this.loginId = loginId;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getLoginId() {
        return loginId;
    }

    public String getPassword() {
        return password;
    }

    public boolean isCorrectPassword(String password) {
        return this.getPassword().equals(SecurityUtils.sha256EncryptHex2(password));
    }
}
