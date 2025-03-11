package card_recommend_project.card_recommend_project;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CardQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private final QCard card = QCard.card;
    private final QOffer offer=QOffer.offer;

    public CardQueryRepository(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
    }


    public List<Card> findAll(
            List<String> cardBrand,
            Integer record,
            Integer fee,
            List<String> benefit
    ) {
        return jpaQueryFactory
                .selectFrom(card)
                .where(
                        //월사용액 필터
                        filterCardsBySpending(record),
                        findByKeyWord(cardBrands),
                        findByFee(fee != null ? String.valueOf(fee) : null)
                )
                .fetch();
    }

  private BooleanExpression filterCardsBySpending(Integer record) {
        if (record == null) {
            return null;
        }
        switch (record) {
            case 30:
                return card.cardRecord.loe(300000);
            case 50:
                return card.cardRecord.loe(500000);
            case 51:
                return card.cardRecord.gt(500000);
            default:
                return null;
        }
    }
  
    private BooleanExpression findByFee(String feeStatus){
        if(feeStatus==null){
            return null;
        }
        if(feeStatus.equals("~30000")){
            return card.domesticOffer.amount.loe(30000).and(card.overseasOffer.amount.loe(30000));
        }
        if(feeStatus.equals("~50000")){
            return card.domesticOffer.amount.loe(50000).and(card.overseasOffer.amount.loe(50000));
        }
        else {
            return card.domesticOffer.amount.gt(50000).and(card.overseasOffer.amount.gt(50000));
        }

    }

    public BooleanExpression cardBrand(List<String> cardBrands) {
        if (cardBrands == null) {
            return null;
        }
        return card.cardBrand.in(cardBrands);
    }

}
