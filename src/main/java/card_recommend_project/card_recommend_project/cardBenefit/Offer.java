package card_recommend_project.card_recommend_project.cardBenefit;

import card_recommend_project.card_recommend_project.card.Card_In_Out;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Enumerated;
import lombok.Getter;

@Getter
@Embeddable
public class Offer {

    @Enumerated
    private Card_In_Out type;

    private Integer amount;

    public Offer() {
    }

    public Offer(Card_In_Out type, Integer amount) {
        this.type = type;
        this.amount = amount;
    }
}