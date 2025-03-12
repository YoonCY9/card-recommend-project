package card_recommend_project.card_recommend_project;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CardQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private final QCard card = QCard.card;
    private final QOffer offer=QOffer.offer;
    private final QCardBenefit cardBenefit = QCardBenefit.cardBenefit;

    public CardQueryRepository(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
    }


    public List<Card> findAll(
            List<String> cardBrands,
            Integer record,
            Integer fee,
            List<Category> benefit,
            Pageable pageable
    ) {
        return jpaQueryFactory
                .selectFrom(card)
                .where(
                        //월사용액 필터
                        filterCardsBySpending(record),
                        cardBrand(cardBrands),
                        findByFee(fee),
                        hasBenefitCategories(benefit)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

  private BooleanExpression filterCardsBySpending(Integer record) {
        if (record == null) {
            return null;
        }
        return card.cardRecord.loe(record);
    }
  
    private BooleanExpression findByFee(Integer fee){
        if(fee==null){
            return null;
        }
        return card.domesticOffer.amount.loe(fee).or(card.overseasOffer.amount.loe(fee));


    }

    public BooleanExpression cardBrand(List<String> cardBrands) {
        if (cardBrands == null) {
            return null;
        }
        return card.cardBrand.in(cardBrands);
    }

    private BooleanExpression hasBenefitCategories(List<Category> benefit) {
        if (benefit == null||benefit.isEmpty()) {
            return null;
        }
        return card.id.in(
                JPAExpressions.select(cardBenefit.cardId.id) // CardBenefit의 Card의 id를 선택
                        .from(cardBenefit) // CardBenefit 엔티티에서
                        .where(cardBenefit.bnfName.in(benefit)) // bnfName이 benefit 리스트에 포함된 것만
        );
//        현재 메서드(findAll)의 반환 타입은 List<Card>
//        그런데 조건으로 사용하려는 필드는 Card 엔티티 자체가 아니라,
//        연관된 엔티티인 CardBenefit에 존재하는 필드(bnfName)이다.
//        즉, 다른 엔티티의 필드를 기준으로 필터링하려면, 반드시 서브쿼리 또는 조인을 사용해야 함.
        // (조인은 양방향일때 사용가능)
    }

}
