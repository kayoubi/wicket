package com.pingone.fuji.web.usr;

import com.pingone.fuji.web.dto.UserDto;
import com.pingone.fuji.web.svc.FujiSvc;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.form.CheckBox;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.PasswordTextField;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.panel.FeedbackPanel;
import org.apache.wicket.model.PropertyModel;
import org.apache.wicket.spring.injection.annot.SpringBean;
import org.apache.wicket.validation.validator.EmailAddressValidator;

/**
 * @author Khaled Ayoubi
 */
public class AddUser extends WebPage {
    private UserDto user;

    @SpringBean
    private FujiSvc fujiSvc;

    public AddUser() {
        super();
        user = new UserDto();
        add(new Label("title", "Save User"));
        add(new FeedbackPanel("feedback"));
        add(new UserForm("form"));
    }

    private class UserForm extends Form<UserDto> {
        private UserForm(String id) {
            super(id);

            add(new TextField<String>("email", new PropertyModel<String>(user, "email")).setRequired(true).add(EmailAddressValidator.getInstance()));
            add(new TextField<String>("firstName", new PropertyModel<String>(user, "firstName")).setRequired(true));
            add(new TextField<String>("lastName", new PropertyModel<String>(user, "lastName")).setRequired(true));
            add(new PasswordTextField("password", new PropertyModel<String>(user, "password")));
            add(new CheckBox("notspambot", new PropertyModel<Boolean>(user, "notSpamBot")));
        }

        @Override
        protected void onSubmit() {
            fujiSvc.saveUser(user);
        }

        @Override
        protected void onValidateModelObjects() {
            super.onValidate();
            if (!hasError()) {
                if (fujiSvc.isEmailTakenByAUser(user.getEmail())) {
//                    error(new ValidationError().addMessageKey("existingUser"));
                    error("User already exist");
                }
                if (!user.isNotSpamBot()) {
                    error("You must not be a spambot");
                }
            }
        }
    }
}
