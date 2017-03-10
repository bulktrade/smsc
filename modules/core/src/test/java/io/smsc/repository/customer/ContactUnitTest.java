package io.smsc.repository.customer;

import io.smsc.AbstractTest;
import io.smsc.model.customer.Contact;
import io.smsc.model.customer.Customer;
import io.smsc.model.customer.Salutation;
import io.smsc.model.customer.Type;
import org.junit.Before;
import org.junit.Test;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class ContactUnitTest extends AbstractTest {

    private Contact contact1;
    private Contact contact2;

    @Before
    public void initContacts() throws Exception {
        this.contact1 = new Contact();
        this.contact2 = new Contact();
        contact1.setId(1L);
        contact1.setFirstname("SMSC");
        contact1.setSurname("SMSC");
        contact1.setPhone("0322222222");
        contact1.setMobilePhone("0632222222");
        contact1.setFax("new_fake_fax");
        contact1.setEmailAddress("new_fake@gmail.com");
        contact1.setType(Type.PRIMARY);
        contact1.setSalutation(Salutation.MRS);
        contact1.setCustomer(new Customer());
        contact2.setId(1L);
        contact2.setFirstname("SMSC");
        contact2.setSurname("SMSC");
        contact2.setPhone("0322222222");
        contact2.setMobilePhone("0632222222");
        contact2.setFax("new_fake_fax");
        contact2.setEmailAddress("new_fake@gmail.com");
        contact2.setType(Type.PRIMARY);
        contact2.setSalutation(Salutation.MRS);
        contact2.setCustomer(new Customer());
    }

    @Test
    public void testEqualsAndHashcodeSameContact() throws Exception {
        assertThat(contact1).isEqualTo(contact1);
    }

    @Test
    public void testEqualsAndHashcodePairOfEqualContacts() throws Exception {
        assertThat(contact1).isEqualTo(contact2);
    }

    @Test
    public void testEqualsAndHashcodeContactAndNull() throws Exception {
        assertThat(contact1).isNotEqualTo(null);
    }

    @Test
    public void testEqualsAndHashcodeContactAndOtherObject() throws Exception {
        assertThat(contact1).isNotEqualTo(new Customer());
    }

    @Test
    public void testEqualsAndHashcodePairOfNonEqualContacts() throws Exception {
        contact2.setId(2L);
        assertThat(contact1).isNotEqualTo(contact2);
    }

    @Test
    public void testEqualsAndHashcodeEqualContactsInSet() throws Exception {
        Set<Contact> set = new HashSet<>();
        set.add(contact1);
        set.add(contact2);
        assertThat(set.size()).isEqualTo(1);
    }
}
