package card_recommend_project.card_recommend_project;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
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

    @Column(length = 10000)
    private String bnfDetail;

    @ManyToOne
    @JoinColumn(name = "card_id")
    private Card cardId;

    protected CardBenefit() {
    }

}
