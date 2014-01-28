package com.pingone.fuji.web.ui.usr;

import com.pingone.fuji.web.svc.FujiSvc;
import org.apache.wicket.spring.injection.annot.SpringComponentInjector;
import org.apache.wicket.spring.test.ApplicationContextMock;
import org.apache.wicket.util.tester.FormTester;
import org.apache.wicket.util.tester.WicketTester;
import org.junit.After;
import org.junit.BeforeClass;
import org.junit.Test;

import static org.mockito.Mockito.*;

/**
 * @author Khaled Ayoubi
 */
public class AddUserTest {

    private static WicketTester tester;

    private static FujiSvc svc;

    @BeforeClass
    public static void setUp() {
        ApplicationContextMock appContextMock = new ApplicationContextMock();
        svc = mock(FujiSvc.class);
        appContextMock.putBean(svc);

        tester = new WicketTester();
        SpringComponentInjector injector = new SpringComponentInjector(tester.getApplication(), appContextMock, true);
        tester.getApplication().getComponentInstantiationListeners().add(injector);
    }

    @After
    public void tearDown() {
        reset(svc);
    }

    @Test
    public void testUserMustNotBeSpambot() {
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
        when(svc.isEmailTakenByAUser("existing@gmail.com")).thenReturn(true);

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
    public void testCanAddValidUser() {
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
