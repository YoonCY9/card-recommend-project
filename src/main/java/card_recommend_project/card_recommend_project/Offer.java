package card_recommend_project.card_recommend_project;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;

@Getter
@Embeddable
public class Offer {

    @Enumerated
    private Card_In_Out type;

    private Integer amount;


}