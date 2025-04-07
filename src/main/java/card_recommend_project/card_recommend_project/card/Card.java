package card_recommend_project.card_recommend_project.card;

import card_recommend_project.card_recommend_project.cardBenefit.Offer;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;

@Entity
@Getter
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

    private Integer cardRecord;

    //    @Enumerated(EnumType.STRING)
    private List<String> cardOverseas;

    protected Card() {
    }

    public Card(String cardName, String cardBrand, Offer domesticOffer, Offer overseasOffer, String cardImg, Integer cardRecord, List<String> cardOverseas) {
        this.cardName = cardName;
        this.cardBrand = cardBrand;
        this.domesticOffer = domesticOffer;
        this.overseasOffer = overseasOffer;
        this.cardImg = cardImg;
        this.cardRecord = cardRecord;
        this.cardOverseas = cardOverseas;
    }

    public String getSafeDomesticOfferType() {
        if (this.domesticOffer != null) {
            return this.domesticOffer.getType().name();
        }
        return null;
    }

    public Integer getSafeDomesticOfferAmount() {
        if (this.domesticOffer != null) {
            return this.domesticOffer.getAmount();
        }
        return null;
    }

    public String getSafeOverseasOfferType() {
        if (this.overseasOffer != null) {
            return this.overseasOffer.getType().name();
        }
        return null;
    }

    public Integer getSafeOverseasOfferAmount() {
        if (this.overseasOffer != null) {
            return this.overseasOffer.getAmount();
        }
        return null;
    }
}
