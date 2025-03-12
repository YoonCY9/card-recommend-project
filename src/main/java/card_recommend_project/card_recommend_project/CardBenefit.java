package card_recommend_project.card_recommend_project;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class CardBenefit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Category bnfName;

    private String bnfContent;

    private String bnfDetail;

    @ManyToOne
    private Card card;

    protected CardBenefit() {
    }
}
