FROM openjdk:17-oracle

COPY target/ams-uh2-attendance-0.0.1-SNAPSHOT.jar /ams-uh2-attendance.jar

RUN mkdir -p /home/certs/
#RUN mkdir -p C:/Users/admin/Desktop/ams-uh2-attendance-master/src/main/resources/keystore/certs/

COPY src/main/resources/keystore/cacerts /home/certs/cacerts
#COPY src/main/resources/keystore/cacerts  C:/Users/admin/Desktop/ams-uh2-attendance-master/src/main/resources/keystore/cacerts

ENTRYPOINT [ "java", "-Djavax.net.ssl.trustAnchors=/home/certs/cacerts", "-Djavax.net.ssl.trustStore=/home/certs/cacerts", "-Djavax.net.ssl.trustStorePassword=64cb9c3559d", "-jar", "/ams-uh2-attendance.jar"]
#ENTRYPOINT [ "java", "-jar", "/ams-uh2-attendance.jar"]