package card_recommend_project.card_recommend_project.google;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    // setter 때문에 record로 못만드러용..
    private String role;
    private String name;
    private String username;
    private String picture;
}
