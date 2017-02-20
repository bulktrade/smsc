package io.smsc.repository.acl;

import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;
import io.smsc.model.acl.AclEntry;
import io.smsc.model.acl.AclObjectIdentity;
import io.smsc.model.acl.QAclEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.querydsl.binding.SingleValueBinding;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;

/**
 * This REST repository class is used for providing default {@link JpaRepository}
 * CRUD methods to operate with {@link AclEntry} entities and exporting them to
 * appropriate endpoints.
 *
 * @author Nazar Lipkovskyy
 * @since 0.0.1-SNAPSHOT
 */
@RepositoryRestResource(collectionResourceRel = "acl-entries", path = "acl-entries")
@Transactional(readOnly = true)
public interface AclEntryRepository extends JpaRepository<AclEntry, Long>,
        QueryDslPredicateExecutor<AclEntry>,
        QuerydslBinderCustomizer<QAclEntry> {

    @Override
    default public void customize(QuerydslBindings bindings, QAclEntry root) {
        bindings.bind(String.class).first((SingleValueBinding<StringPath, String>) StringExpression::containsIgnoreCase);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    void delete(Long id);

    @Override
    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    AclEntry save(AclEntry aclEntry);

    @Override
    @EntityGraph(attributePaths = {"aclObjectIdentity", "sid"})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    AclEntry findOne(Long id);

    @EntityGraph(attributePaths = {"aclObjectIdentity", "sid"})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    AclEntry findByAceOrder(@Param("aceOrder") Integer aceOrder);

    @EntityGraph(attributePaths = {"aclObjectIdentity", "sid"})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    AclEntry findByAclObjectIdentity(@Param("aclObjectIdentity") AclObjectIdentity aclObjectIdentity);

    @Override
    @EntityGraph(attributePaths = {"aclObjectIdentity", "sid"})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    Page<AclEntry> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"aclObjectIdentity", "sid"})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    Page<AclEntry> findAll(Predicate predicate, Pageable pageable);
}
