package card_recommend_project.card_recommend_project;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cardName;

    private String cardBrand;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "type", column = @Column(name = "domestic_offer_type")),
            @AttributeOverride(name = "amount", column = @Column(name = "domestic_offer_amount"))
    })
    private Offer domesticOffer;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "type", column = @Column(name = "overseas_offer_type")),
            @AttributeOverride(name = "amount", column = @Column(name = "overseas_offer_amount"))
    })
    private Offer overseasOffer;

    private String cardImg;

    private int cardRecord;

    @Enumerated
    private List<Overseas> cardOverseas;

    protected Card() {
    }



}
