import org.openqa.selenium.Capabilities;
import org.openqa.selenium.Platform;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.SeleneseCommandExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverBackedSelenium;
import com.opera.core.systems.OperaDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.android.AndroidDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.Command;
import org.openqa.selenium.remote.DesiredCapabilities;

import com.thoughtworks.selenium.Selenium;

class AndroidWrapper extends BrowserWrapper {
	public AndroidWrapper (){
		super();
	}
  public Selenium openBrowser(String url){
    	driver = new AndroidDriver(desiredCapabilities);
			driver.get(url);
    	selenium = new WebDriverBackedSelenium(driver,url);
    	return selenium;
	}
}

