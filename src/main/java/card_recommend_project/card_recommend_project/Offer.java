package card_recommend_project.card_recommend_project;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Enumerated;

@Embeddable
public class Offer {

    @Enumerated
    private Card_In_Out type;

    private int amount;
}