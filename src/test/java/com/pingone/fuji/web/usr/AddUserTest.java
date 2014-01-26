package com.pingone.fuji.web.usr;

import com.pingone.fuji.web.svc.FujiSvc;
import org.apache.wicket.spring.injection.annot.SpringComponentInjector;
import org.apache.wicket.spring.test.ApplicationContextMock;
import org.apache.wicket.util.tester.FormTester;
import org.apache.wicket.util.tester.WicketTester;
import org.junit.Before;
import org.junit.Test;

import static org.mockito.Mockito.*;

/**
 * @author Khaled Ayoubi
 */
public class AddUserTest {
    private ApplicationContextMock appContextMock;

    private SpringComponentInjector injector;

    private WicketTester tester;

    @Before
    public void setUp() {
        appContextMock = new ApplicationContextMock();
        tester = new WicketTester();

        FujiSvc svc = mock(FujiSvc.class);
        when(svc.isEmailTakenByAUser("existing@gmail.com")).thenReturn(true);
        appContextMock.putBean(svc);

        injector = new SpringComponentInjector(tester.getApplication(), appContextMock, true);
        tester.getApplication().getComponentInstantiationListeners().add(injector);
    }

    @Test
    public void testYouMustNotBeSpambot() {
        tester.startPage(AddUser.class);
        FormTester formTester = tester.newFormTester("form");
        formTester.setValue("email", "khaled.ayoubi@gmail.com");
        formTester.setValue("firstName", "khaled");
        formTester.setValue("lastName", "ayoubi");
        formTester.setValue("password", "top-secret");
        formTester.submit();

        tester.assertErrorMessages("You must not be a spambot");
    }

    @Test
    public void testCantAddExistingUser() {
        tester.startPage(AddUser.class);
        FormTester formTester = tester.newFormTester("form");
        formTester.setValue("email", "existing@gmail.com");
        formTester.setValue("firstName", "khaled");
        formTester.setValue("lastName", "ayoubi");
        formTester.setValue("password", "top-secret");
        formTester.setValue("notspambot", Boolean.TRUE);
        formTester.submit();

        tester.assertErrorMessages("User already exist");
    }

    @Test
    public void testCantAddValidUser() {
        tester.startPage(AddUser.class);
        FormTester formTester = tester.newFormTester("form");
        formTester.setValue("email", "new-user@gmail.com");
        formTester.setValue("firstName", "khaled");
        formTester.setValue("lastName", "ayoubi");
        formTester.setValue("password", "top-secret");
        formTester.setValue("notspambot", Boolean.TRUE);
        formTester.submit();

        tester.assertNoErrorMessage();
    }

}
